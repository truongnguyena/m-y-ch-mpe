import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ContactPayload = { name: string; email: string; subject: string; message: string };

@Injectable({ providedIn: 'root' })
export class EmailService {
	baseUrl = localStorage.getItem('php_mail_base') || 'http://localhost:9000';
	backendUrl = localStorage.getItem('ai_backend') || 'http://localhost:8000';

	constructor(private readonly http: HttpClient) {}

	sendContact(payload: ContactPayload) {
		// Try PHP first, then FastAPI backend as fallback
		return this.http.post(`${this.baseUrl}/send_mail.php`, payload);
	}

	sendContactViaBackend(payload: ContactPayload) {
		return this.http.post(`${this.backendUrl}/send_email`, {
			subject: `[kurumianimeshop] ${payload.subject}`,
			body: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
			reply_to: payload.email
		});
	}
}