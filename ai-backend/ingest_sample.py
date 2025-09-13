import json
import requests

BASE = "http://localhost:8000"

catalog = [
    {
        "id": "p1",
        "text": "Figure Tanjiro Kamado 1/8 | giá 1.299.000₫ | tồn kho 12 | series: Demon Slayer | tag: tanjiro, demon slayer, figure | mô tả: figure chi tiết cao.",
        "metadata": {"sku": "FIG-TANJIRO-1-8", "price": 1299000, "stock": 12, "series": "Demon Slayer"}
    },
    {
        "id": "p2",
        "text": "Poster One Piece Wano A2 | giá 99.000₫ | tồn kho 55 | series: One Piece | tag: poster, one piece, wano | mô tả: in sắc nét.",
        "metadata": {"sku": "POS-OP-WANO-A2", "price": 99000, "stock": 55, "series": "One Piece"}
    },
    {
        "id": "p3",
        "text": "Áo thun Gojo Satoru | giá 249.000₫ | tồn kho 32 | series: Jujutsu Kaisen | tag: áo thun, gojo | mô tả: cotton 100%.",
        "metadata": {"sku": "TEE-GOJO-BLACK-M", "price": 249000, "stock": 32, "series": "Jujutsu Kaisen"}
    },
]

faq = [
    {"id": "faq-ship", "text": "Ship nội thành 1-2 ngày, tỉnh 3-5 ngày.", "metadata": {"type": "policy"}},
    {"id": "faq-return", "text": "Đổi trả trong 7 ngày nếu lỗi nhà sản xuất.", "metadata": {"type": "policy"}},
    {"id": "faq-warranty", "text": "Bảo hành 6 tháng cho sản phẩm điện tử/phát sáng.", "metadata": {"type": "policy"}},
]

def ingest(namespace: str, docs: list[dict]):
    r = requests.post(f"{BASE}/ingest", json={"namespace": namespace, "docs": docs})
    r.raise_for_status()
    print(namespace, r.json())

if __name__ == "__main__":
    ingest("catalog", catalog)
    ingest("faq", faq)
    print("Done.")

