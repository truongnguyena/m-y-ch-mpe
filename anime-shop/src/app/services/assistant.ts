import { Injectable, signal } from '@angular/core';

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; text: string; ts: number };

@Injectable({ providedIn: 'root' })
export class AssistantService {
	readonly messages = signal<ChatMessage[]>([
		{ role: 'system', text: 'Xin chào! Mình là trợ lý Anime Shop, mình có thể giúp gì cho bạn?', ts: Date.now() }
	]);

	private replyTo(text: string): string {
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

	sendUserMessage(text: string) {
		const now = Date.now();
		this.messages.update(msgs => [...msgs, { role: 'user', text, ts: now }]);
		const response = this.replyTo(text);
		this.messages.update(msgs => [...msgs, { role: 'assistant', text: response, ts: Date.now() }]);
	}

	clear() { this.messages.set(this.messages().slice(0,1)); }
}
