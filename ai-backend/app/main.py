from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import faiss  # type: ignore
except Exception as e:  # pragma: no cover
    faiss = None

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None  # type: ignore


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
INDEX_PATH = DATA_DIR / "faiss.index"
DOCS_PATH = DATA_DIR / "docs.jsonl"
LOGS_PATH = DATA_DIR / "logs.jsonl"


@dataclass
class Doc:
    id: str
    text: str
    namespace: str
    metadata: Dict[str, Any]


class DocumentStore:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.index = None
        self.dim = 384  # all-MiniLM-L6-v2 output dim
        self.docs: List[Doc] = []
        self.id_to_pos: Dict[str, int] = {}
        self._load_disk()

    def _ensure_model(self):
        if self.model is None:
            if SentenceTransformer is None:
                raise RuntimeError("sentence-transformers not installed")
            self.model = SentenceTransformer(self.model_name)

    def _ensure_index(self):
        if self.index is None:
            if faiss is None:
                raise RuntimeError("faiss-cpu not installed")
            self.index = faiss.IndexFlatIP(self.dim)

    def _save_disk(self):
        # Save docs
        with DOCS_PATH.open("w", encoding="utf-8") as f:
            for d in self.docs:
                f.write(json.dumps(asdict(d), ensure_ascii=False) + "\n")
        # Save index
        if self.index is not None and faiss is not None:
            faiss.write_index(self.index, str(INDEX_PATH))

    def _load_disk(self):
        # Load docs
        if DOCS_PATH.exists():
            self.docs = []
            self.id_to_pos = {}
            with DOCS_PATH.open("r", encoding="utf-8") as f:
                for line in f:
                    obj = json.loads(line)
                    d = Doc(id=obj["id"], text=obj["text"], namespace=obj.get("namespace", "default"), metadata=obj.get("metadata", {}))
                    self.id_to_pos[d.id] = len(self.docs)
                    self.docs.append(d)
        # Load index
        if INDEX_PATH.exists() and faiss is not None:
            self.index = faiss.read_index(str(INDEX_PATH))

    def _embed(self, texts: List[str]):
        self._ensure_model()
        # Normalize to unit vectors for inner-product similarity
        import numpy as np

        emb = self.model.encode(texts, batch_size=32, show_progress_bar=False, normalize_embeddings=True)
        return emb.astype("float32")

    def add_docs(self, docs: List[Doc]):
        if not docs:
            return 0
        self._ensure_index()
        # New docs filtering by id
        new_docs: List[Doc] = []
        for d in docs:
            if d.id not in self.id_to_pos:
                self.id_to_pos[d.id] = len(self.docs) + len(new_docs)
                new_docs.append(d)
        if not new_docs:
            return 0
        embs = self._embed([d.text for d in new_docs])
        self.index.add(embs)
        self.docs.extend(new_docs)
        self._save_disk()
        return len(new_docs)

    def search(self, query: str, top_k: int = 5, namespace: Optional[str] = None) -> List[Tuple[float, Doc]]:
        if self.index is None or len(self.docs) == 0:
            return []
        import numpy as np

        q = self._embed([query])
        scores, idxs = self.index.search(q, top_k)
        result: List[Tuple[float, Doc]] = []
        for score, idx in zip(scores[0].tolist(), idxs[0].tolist()):
            if idx < 0 or idx >= len(self.docs):
                continue
            d = self.docs[idx]
            if namespace and d.namespace != namespace:
                continue
            result.append((float(score), d))
        return result


app = FastAPI(title="kurumianimeshop AI Backend", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = DocumentStore()


class IngestDoc(BaseModel):
    id: str
    text: str
    metadata: Dict[str, Any] = {}


class IngestRequest(BaseModel):
    namespace: str = "default"
    docs: List[IngestDoc]


class SearchResponseDoc(BaseModel):
    id: str
    text: str
    namespace: str
    metadata: Dict[str, Any]
    score: float


class ChatTurn(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    user_id: Optional[str] = None
    query: str
    history: List[ChatTurn] = []
    top_k: int = 4
    namespace: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    contexts: List[SearchResponseDoc]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ingest")
def ingest(req: IngestRequest):
    docs = [Doc(id=d.id, text=d.text, namespace=req.namespace, metadata=d.metadata) for d in req.docs]
    added = store.add_docs(docs)
    return {"added": added}


@app.get("/search")
def search(query: str, top_k: int = 5, namespace: Optional[str] = None):
    results = store.search(query, top_k=top_k, namespace=namespace)
    return [
        SearchResponseDoc(id=d.id, text=d.text, namespace=d.namespace, metadata=d.metadata, score=s)
        for s, d in results
    ]


def build_answer(query: str, contexts: List[Doc]) -> str:
    # Simple extractive answer with templating (no heavy LLM by default)
    if not contexts:
        return (
            "Xin lỗi, mình chưa có thông tin phù hợp trong kho tri thức. "
            "Bạn có thể hỏi về sản phẩm, tồn kho, giá, hoặc chính sách."
        )
    bullets = "\n".join([f"- {c.text[:300]}" for c in contexts[:4]])
    return (
        "Dựa trên thông tin tìm thấy:\n"
        f"{bullets}\n\n"
        f"Trả lời ngắn gọn cho câu hỏi '{query}': "
        "(Nếu cần chi tiết hơn, vui lòng yêu cầu thêm.)"
    )


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    hits = store.search(req.query, top_k=req.top_k, namespace=req.namespace)
    docs = [d for _, d in hits]
    answer = build_answer(req.query, docs)

    # Log
    log = {
        "ts": int(time.time()),
        "user_id": req.user_id,
        "query": req.query,
        "history": [t.model_dump() for t in req.history],
        "answer": answer,
        "contexts": [asdict(d) for d in docs],
    }
    with LOGS_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(log, ensure_ascii=False) + "\n")

    return ChatResponse(
        answer=answer,
        contexts=[SearchResponseDoc(id=d.id, text=d.text, namespace=d.namespace, metadata=d.metadata, score=float(s)) for s, d in hits]
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=False)

