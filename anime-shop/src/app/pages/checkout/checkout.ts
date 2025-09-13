import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CurrencyPipe } from '@angular/common';
import { PaymentService } from '../../services/payment';
import { WalletService } from '../../services/wallet';

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
        <fieldset class="method">
          <legend>Hình thức thanh toán</legend>
          <label><input type="radio" name="method" [(ngModel)]="method" value="bank" required /> Chuyển khoản ngân hàng</label>
          <label><input type="radio" name="method" [(ngModel)]="method" value="coins" required /> Dùng xu trong ví</label>
        </fieldset>
        @if (method === 'bank') {
          <label>Mã xác thực (từ Gmail)
            <input name="code" [(ngModel)]="verificationCode" placeholder="Nhập mã 6+ ký tự" />
          </label>
          <small>Sau khi ngân hàng nhận tiền, hệ thống sẽ gửi mail có mã. Nhập mã này để đổi ra xu.</small>
        }
        <div class="summary">
          <span>Tổng đơn:</span>
          <strong>{{ cart.totalVnd() | currency:'VND':'symbol':'1.0-0' }}</strong>
        </div>
        <button [disabled]="!f.form.valid || cart.totalItems() === 0">Thanh toán</button>
      </form>
    </div>
  `,
  styles: `
    .form { display: grid; gap: 12px; }
    input { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: #fff; }
    button { padding: 10px 12px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
    .summary { display: flex; justify-content: space-between; align-items: center; }
    fieldset.method { border: 1px dashed rgba(255,255,255,.2); border-radius: 10px; padding: 10px 12px; }
  `
})
export class Checkout {
  name = '';
  address = '';
  phone = '';
  method: 'bank' | 'coins' = 'bank';
  verificationCode = '';

  constructor(public readonly cart: CartService, private readonly payment: PaymentService, public readonly wallet: WalletService) {}

  submit() {
    if (this.cart.totalItems() <= 0) return;
    if (this.method === 'bank') {
      this.payment.payWithBank(this.verificationCode).then(ok => {
        alert(ok ? 'Thanh toán thành công! Xu đã được cộng.' : 'Mã xác thực không hợp lệ.');
      });
    } else {
      const ok = this.wallet.spendVndWithCoins(this.cart.totalVnd());
      if (ok) { this.cart.clear(); alert('Thanh toán bằng xu thành công!'); }
      else { alert('Xu không đủ để thanh toán.'); }
    }
  }
}
