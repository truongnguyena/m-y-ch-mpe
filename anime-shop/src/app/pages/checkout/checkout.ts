import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="card">
      <h2>Thanh toán</h2>
      <form class="form" (ngSubmit)="submit()" #f="ngForm">
        <label>Họ tên
          <input name="name" [(ngModel)]="name" required />
        </label>
        <label>Địa chỉ
          <input name="address" [(ngModel)]="address" required />
        </label>
        <label>Số điện thoại
          <input name="phone" [(ngModel)]="phone" required />
        </label>
        <div class="summary">
          <span>Tổng đơn:</span>
          <strong>{{ cart.totalVnd() | currency:'VND':'symbol':'1.0-0' }}</strong>
        </div>
        <button [disabled]="!f.form.valid || cart.totalItems() === 0">Đặt hàng</button>
      </form>
    </div>
  `,
  styles: `
    .form { display: grid; gap: 12px; }
    input { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: #fff; }
    button { padding: 10px 12px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
    .summary { display: flex; justify-content: space-between; align-items: center; }
  `
})
export class Checkout {
  name = '';
  address = '';
  phone = '';

  constructor(public readonly cart: CartService) {}

  submit() {
    if (this.cart.totalItems() > 0) {
      this.cart.clear();
      alert('Đặt hàng thành công!');
    }
  }
}
