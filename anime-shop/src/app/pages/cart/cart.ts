import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { CartService } from '../../services/cart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [NgFor, CurrencyPipe],
  template: `
    <div class="card">
      <h2>Giỏ hàng</h2>
      @if (cart.lines(); as lines) {
        <div class="lines">
          <div class="line" *ngFor="let l of lines">
            <img [src]="l.product.image" [alt]="l.product.name" />
            <div class="meta">
              <div class="name">{{ l.product.name }}</div>
              <div class="price">{{ l.product.priceVnd | currency:'VND':'symbol':'1.0-0' }}</div>
            </div>
            <div class="qty">
              <button (click)="dec(l.product.id)">-</button>
              <span>{{ l.quantity }}</span>
              <button (click)="inc(l.product.id)">+</button>
            </div>
            <div class="sum">{{ (l.product.priceVnd * l.quantity) | currency:'VND':'symbol':'1.0-0' }}</div>
            <button class="remove" (click)="remove(l.product.id)">×</button>
          </div>
          <div class="total">
            <span>Tổng cộng:</span>
            <strong>{{ cart.totalVnd() | currency:'VND':'symbol':'1.0-0' }}</strong>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    h2 { margin-top: 0; }
    .line { display: grid; grid-template-columns: 72px 1fr auto auto auto; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
    .line img { width: 72px; height: 72px; object-fit: cover; border-radius: 8px; }
    .qty { display: inline-flex; gap: 8px; align-items: center; }
    .qty button { width: 28px; height: 28px; border-radius: 8px; border: 0; background: rgba(255,255,255,.1); color: #fff; }
    .remove { border: 0; background: transparent; color: var(--text-300); font-size: 20px; }
    .total { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; }
  `
})
export class Cart {
  constructor(public readonly cart: CartService) {}

  inc(id: number) { this.cart.setQuantity(id, (this.cart.lines().find(l => l.product.id === id)?.quantity ?? 0) + 1); }
  dec(id: number) { this.cart.setQuantity(id, (this.cart.lines().find(l => l.product.id === id)?.quantity ?? 0) - 1); }
  remove(id: number) { this.cart.remove(id); }
}
