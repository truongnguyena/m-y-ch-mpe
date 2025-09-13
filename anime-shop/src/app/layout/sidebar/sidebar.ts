import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <span class="logo">✦</span>
        <span class="name">Anime Shop</span>
      </div>
      <nav class="menu">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Trang chủ
        </a>
        <a routerLink="/products" routerLinkActive="active">Sản phẩm</a>
        <a routerLink="/cart" routerLinkActive="active">Giỏ hàng</a>
        <a routerLink="/checkout" routerLinkActive="active">Thanh toán</a>
        <a routerLink="/wallet" routerLinkActive="active">Ví xu</a>
      </nav>
    </aside>
  `,
  styles: `
    .sidebar {
      height: 100vh;
      position: sticky;
      top: 0;
      background: linear-gradient(180deg, #2a1a3a 0%, #1e1430 100%);
      border-right: 1px solid rgba(255,255,255,0.08);
      padding: 20px 16px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .logo {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--pink-500), var(--purple-600));
      color: white;
      font-weight: 800;
    }
    .name {
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .menu {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 12px;
    }
    .menu a {
      display: block;
      color: var(--text-300);
      text-decoration: none;
      padding: 10px 12px;
      border-radius: 10px;
      transition: all .2s ease;
    }
    .menu a:hover {
      color: white;
      background: linear-gradient(90deg, rgba(255,79,163,.15), rgba(138,92,255,.15));
    }
    .menu a.active {
      color: white;
      background: linear-gradient(90deg, rgba(255,79,163,.25), rgba(138,92,255,.25));
      box-shadow: 0 0 0 1px rgba(255,79,163,.25) inset;
    }
  `
})
export class Sidebar {

}
