import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../services/wallet';

@Component({
  selector: 'app-wallet',
  imports: [CurrencyPipe, FormsModule],
  template: `
    <div class="card">
      <h2>Ví xu</h2>
      <div class="grid">
        <div class="tile"><strong>Ruby</strong><span>{{ wallet.balances().ruby }}</span></div>
        <div class="tile"><strong>Kim cương</strong><span>{{ wallet.balances().kim_cuong }}</span></div>
        <div class="tile"><strong>Vàng</strong><span>{{ wallet.balances().vang }}</span></div>
        <div class="tile"><strong>Bạc</strong><span>{{ wallet.balances().bac }}</span></div>
        <div class="tile"><strong>Đồng</strong><span>{{ wallet.balances().dong }}</span></div>
      </div>
      <div class="summary">Tổng giá trị: <strong>{{ wallet.totalVnd() | currency:'VND':'symbol':'1.0-0' }}</strong></div>

      <form class="refund" (ngSubmit)="refund()" #rf="ngForm">
        <label>Tầng xu
          <select name="tier" [(ngModel)]="tier">
            <option value="ruby">Ruby</option>
            <option value="kim_cuong">Kim cương</option>
            <option value="vang">Vàng</option>
            <option value="bac">Bạc</option>
            <option value="dong">Đồng</option>
          </select>
        </label>
        <label>Số lượng
          <input type="number" name="amount" [(ngModel)]="amount" min="1" />
        </label>
        <button>Đổi xu hoàn tiền</button>
      </form>
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; margin-bottom: 12px; }
    .tile { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; }
    .summary { margin: 10px 0; }
    .refund { display: flex; gap: 10px; align-items: end; }
    select, input { padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: #fff; }
    button { padding: 10px 12px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
  `
})
export class WalletComponent {
  tier: 'dong'|'bac'|'vang'|'kim_cuong'|'ruby' = 'dong';
  amount = 1;

  constructor(public readonly wallet: WalletService) {}

  refund() {
    const vnd = this.wallet.refundCoinsToVnd(this.tier, this.amount);
    alert(`Hoàn tiền: ${vnd.toLocaleString('vi-VN')} ₫`);
  }
}
