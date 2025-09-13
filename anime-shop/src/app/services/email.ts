import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ContactPayload = { name: string; email: string; subject: string; message: string };

@Injectable({ providedIn: 'root' })
export class EmailService {
	baseUrl = localStorage.getItem('php_mail_base') || 'http://localhost:9000';

	constructor(private readonly http: HttpClient) {}

	sendContact(payload: ContactPayload) {
		return this.http.post(`${this.baseUrl}/send_mail.php`, payload);
	}
}