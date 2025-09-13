import { Injectable, computed, signal } from '@angular/core';
import type { ProductItem } from './product';

export type CartLine = { product: ProductItem; quantity: number };

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly linesSignal = signal<CartLine[]>([]);

  readonly lines = this.linesSignal.asReadonly();
  readonly totalItems = computed(() => this.linesSignal().reduce((s, l) => s + l.quantity, 0));
  readonly totalVnd = computed(() => this.linesSignal().reduce((s, l) => s + l.product.priceVnd * l.quantity, 0));

  add(product: ProductItem, quantity = 1) {
    const next = [...this.linesSignal()];
    const idx = next.findIndex(l => l.product.id === product.id);
    if (idx >= 0) next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
    else next.push({ product, quantity });
    this.linesSignal.set(next);
  }

  remove(productId: number) {
    this.linesSignal.set(this.linesSignal().filter(l => l.product.id !== productId));
  }

  setQuantity(productId: number, quantity: number) {
    const next = this.linesSignal().map(l => l.product.id === productId ? { ...l, quantity } : l);
    this.linesSignal.set(next.filter(l => l.quantity > 0));
  }

  clear() { this.linesSignal.set([]); }
}
