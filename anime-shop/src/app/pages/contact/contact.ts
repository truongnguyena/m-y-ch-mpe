import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  template: `
    <div class="card">
      <h2>Liên hệ</h2>
      <form class="form" (ngSubmit)="submit()" #f="ngForm">
        <label>Họ tên
          <input name="name" [(ngModel)]="name" required />
        </label>
        <label>Email
          <input name="email" [(ngModel)]="email" required />
        </label>
        <label>Tiêu đề
          <input name="subject" [(ngModel)]="subject" required />
        </label>
        <label>Nội dung
          <textarea name="message" [(ngModel)]="message" rows="6" required></textarea>
        </label>
        <div class="actions">
          <button [disabled]="sending">Gửi</button>
          <span class="status">{{ status }}</span>
        </div>
      </form>
    </div>
  `,
  styles: `
    .form { display: grid; gap: 12px; }
    input, textarea { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: #fff; }
    .actions { display: flex; gap: 10px; align-items: center; }
    button { padding: 10px 12px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
    .status { opacity: .85; }
  `
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';
  status = '';
  sending = false;

  constructor(private readonly emailService: EmailService) {}

  async submit() {
    this.sending = true;
    this.status = 'Đang gửi...';
    try {
      await this.emailService.sendContact({ name: this.name, email: this.email, subject: this.subject, message: this.message }).toPromise();
      this.status = 'Đã gửi liên hệ!';
      this.name = this.email = this.subject = this.message = '';
    } catch {
      this.status = 'Gửi thất bại. Vui lòng thử lại.';
    } finally {
      this.sending = false;
    }
  }
}
