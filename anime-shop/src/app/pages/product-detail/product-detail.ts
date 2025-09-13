import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  template: `
    @if (product(); as p) {
      <div class="detail card">
        <img class="poster" [src]="p?.image" [alt]="p?.name" />
        <div class="meta">
          <h2>{{ p?.name }}</h2>
          <p class="desc">{{ p?.description }}</p>
          <div class="row">
            <span class="price">{{ p?.priceVnd | currency:'VND':'symbol':'1.0-0' }}</span>
            <button (click)="addToCart()">Thêm vào giỏ</button>
          </div>
          <a routerLink="/products">← Quay lại sản phẩm</a>
        </div>
      </div>
    } @else {
      <p>Không tìm thấy sản phẩm.</p>
    }
  `,
  styles: `
    .detail { display: grid; grid-template-columns: 320px 1fr; gap: 20px; }
    .poster { width: 100%; height: 320px; object-fit: cover; border-radius: 12px; }
    .row { display: flex; align-items: center; gap: 16px; margin: 12px 0; }
    .price { color: var(--pink-100); font-weight: 800; font-size: 20px; }
    button { padding: 10px 12px; border: 0; border-radius: 10px; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
  `
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly products = inject(ProductService);
  private readonly cart = inject(CartService);

  private readonly idSignal = signal<number | null>(null);
  product = computed(() => {
    const id = this.idSignal();
    return id == null ? undefined : this.products.getById(id);
  });

  constructor() {
    this.route.paramMap.subscribe(map => {
      const id = Number(map.get('id'));
      this.idSignal.set(Number.isFinite(id) ? id : null);
    });
  }

  addToCart() { const p = this.product(); if (p) this.cart.add(p, 1); }
}
