import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-ingest',
  imports: [FormsModule],
  template: `
    <div class="card">
      <h2>Admin: Nạp dữ liệu (Catalog/FAQ)</h2>
      <div class="row">
        <label>Backend URL
          <input [(ngModel)]="backend" placeholder="http://localhost:8000" />
        </label>
        <label>Namespace
          <input [(ngModel)]="namespace" placeholder="catalog hoặc faq" />
        </label>
      </div>
      <p><strong>CSV</strong> cột gợi ý: id,text,metadata_json. Hoặc <strong>JSONL</strong> mỗi dòng: &#123; id, text, metadata &#125;.</p>
      <textarea [(ngModel)]="raw" rows="12" placeholder="Dán CSV hoặc JSONL vào đây..."></textarea>
      <div class="actions">
        <button (click)="ingestCsv()">Nạp CSV</button>
        <button (click)="ingestJsonl()">Nạp JSONL</button>
        <span class="status">{{ status }}</span>
      </div>
    </div>
  `,
  styles: `
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    input, textarea { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: #fff; }
    .actions { display: flex; gap: 10px; align-items: center; margin-top: 10px; }
    button { padding: 10px 12px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
    .status { opacity: .85; }
  `
})
export class AdminIngestComponent {
  backend = localStorage.getItem('ai_backend') || 'http://localhost:8000';
  namespace = 'catalog';
  raw = '';
  status = '';

  constructor(private readonly http: HttpClient) {}

  private parseCsv(text: string): Array<{id:string,text:string,metadata:any}> {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length);
    if (!lines.length) return [];
    const header = lines[0].split(',').map(s => s.trim());
    const out: any[] = [];
    for (let i=1;i<lines.length;i++) {
      const cols = lines[i].split(',');
      const row: any = {};
      header.forEach((h, idx) => row[h] = cols[idx] ?? '');
      let metadata: any = {};
      try { metadata = row.metadata_json ? JSON.parse(row.metadata_json) : {}; } catch {}
      out.push({ id: String(row.id || i), text: String(row.text || ''), metadata });
    }
    return out;
  }

  async ingestCsv() {
    this.status = 'Đang nạp CSV...';
    try {
      const docs = this.parseCsv(this.raw);
      await this.http.post(`${this.backend}/ingest`, { namespace: this.namespace, docs }).toPromise();
      this.status = `Đã nạp ${docs.length} dòng CSV.`;
    } catch (e: any) {
      this.status = 'Lỗi nạp CSV.';
    }
  }

  async ingestJsonl() {
    this.status = 'Đang nạp JSONL...';
    try {
      const docs = this.raw.split(/\r?\n/).filter(l => l.trim().length).map(l => JSON.parse(l));
      await this.http.post(`${this.backend}/ingest`, { namespace: this.namespace, docs }).toPromise();
      this.status = `Đã nạp ${docs.length} dòng JSONL.`;
    } catch (e: any) {
      this.status = 'Lỗi nạp JSONL.';
    }
  }
}
