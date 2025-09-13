import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; text: string; ts: number };

const DEFAULT_BACKEND = localStorage.getItem('ai_backend') || 'http://localhost:8000';
const DEFAULT_AVATAR = localStorage.getItem('ai_avatar') || 'https://cdn.jsdelivr.net/gh/andatare/placeholder@main/anime-white-hair-blue-eyes.png';

@Injectable({ providedIn: 'root' })
export class AssistantService {
	readonly messages = signal<ChatMessage[]>([
		{ role: 'system', text: 'Xin chào! Mình là trợ lý Anime Shop, mình có thể giúp gì cho bạn?', ts: Date.now() }
	]);

	readonly avatarUrl = DEFAULT_AVATAR;
	backendBase = DEFAULT_BACKEND;

	constructor(private readonly http: HttpClient) {}

	private ruleReply(text: string): string {
		const t = text.toLowerCase();
		if (t.includes('giỏ') || t.includes('cart')) {
			return 'Bạn có thể xem và chỉnh sửa giỏ tại menu Giỏ hàng. Cần mình thêm sản phẩm nào không?';
		}
		if (t.includes('thanh toán') || t.includes('checkout') || t.includes('bank')) {
			return 'Để thanh toán, vào Thanh toán. Bạn có thể chọn chuyển khoản (nhập mã Gmail) hoặc dùng xu trong ví.';
		}
		if (t.includes('ví') || t.includes('xu') || t.includes('wallet') || t.includes('coin')) {
			return 'Trang Ví hiển thị số dư xu (đồng, bạc, vàng, kim cương, ruby). Bạn có thể đổi xu hoàn tiền tại đó.';
		}
		if (t.includes('sản phẩm') || t.includes('figure') || t.includes('poster') || t.includes('áo')) {
			return 'Bạn có thể xem Sản phẩm để duyệt figure, poster, áo thun và phụ kiện.';
		}
		return 'Mình chưa rõ ý bạn. Bạn cần tìm sản phẩm, thanh toán hay trợ giúp ví xu?';
	}

	async sendUserMessage(text: string) {
		const now = Date.now();
		this.messages.update(msgs => [...msgs, { role: 'user', text, ts: now }]);
		try {
			const res: any = await this.http.post(`${this.backendBase}/chat`, {
				query: text,
				history: this.messages().map(m => ({ role: m.role, text: m.text }))
			}).toPromise();
			const answer = res?.answer ?? this.ruleReply(text);
			this.messages.update(msgs => [...msgs, { role: 'assistant', text: answer, ts: Date.now() }]);
		} catch (e) {
			const fallback = this.ruleReply(text);
			this.messages.update(msgs => [...msgs, { role: 'assistant', text: fallback, ts: Date.now() }]);
		}
	}

	clear() { this.messages.set(this.messages().slice(0,1)); }
}
