import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="header">
      <div class="search">
        <input placeholder="Tìm kiếm figure, poster, áo thun..." />
      </div>
      <nav class="actions">
        <a routerLink="/cart" class="pill">Giỏ hàng</a>
      </nav>
    </header>
  `,
  styles: `
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      background: linear-gradient(90deg, rgba(255,79,163,.08), rgba(138,92,255,.08));
      backdrop-filter: blur(6px);
    }
    .search input {
      width: 100%;
      min-width: 320px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: var(--text-100);
      outline: none;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: linear-gradient(135deg, var(--pink-500), var(--purple-600));
      color: #fff;
      text-decoration: none;
      border-radius: 999px;
      font-weight: 600;
      box-shadow: 0 6px 16px rgba(255,79,163,.25);
    }
  `
})
export class Header {

}
