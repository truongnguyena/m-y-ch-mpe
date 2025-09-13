import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="hero card">
      <div class="hero-content">
        <h1>Shop Anime</h1>
        <p>Figure, poster, áo thun và phụ kiện chính hãng.</p>
        <a routerLink="/products" class="cta">Mua ngay</a>
      </div>
    </section>
  `,
  styles: `
    .hero {
      background: radial-gradient(1200px 400px at -20% -20%, rgba(255,79,163,.25), transparent),
                  radial-gradient(1200px 400px at 120% -20%, rgba(138,92,255,.25), transparent),
                  rgba(255,255,255,.04);
      text-align: left;
      padding: 36px;
    }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0 0 16px; color: var(--text-300); }
    .cta {
      display: inline-block;
      padding: 10px 14px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--pink-500), var(--purple-600));
      color: #fff; text-decoration: none; font-weight: 700;
    }
  `
})
export class Home {

}
