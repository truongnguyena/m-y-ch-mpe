import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <div class="grid">
      @for (p of productsSig(); track p.id) {
        <div class="card item">
          <img [src]="p.image" [alt]="p.name" />
          <div class="info">
            <h3>{{ p.name }}</h3>
            <p class="price">{{ p.priceVnd | currency:'VND':'symbol':'1.0-0' }}</p>
          </div>
          <div class="actions">
            <a [routerLink]="['/product', p.id]">Chi tiết</a>
            <button (click)="addToCart(p)">Thêm vào giỏ</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .item img { width: 100%; height: 180px; object-fit: cover; border-radius: 12px; }
    .info { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .price { color: var(--pink-100); font-weight: 700; }
    .actions { display: flex; justify-content: space-between; margin-top: 10px; }
    .actions a { color: var(--text-300); text-decoration: none; }
    .actions button { padding: 8px 10px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
  `
})
export class Products {
  productsSig!: ReturnType<ProductService['list']>;

  constructor(private readonly productService: ProductService, private readonly cart: CartService) {
    this.productsSig = this.productService.list();
  }

  addToCart(p: any) { this.cart.add(p, 1); }
}
