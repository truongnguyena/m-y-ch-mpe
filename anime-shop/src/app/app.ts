import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <div class="app-main">
        <app-header></app-header>
        <div class="page-container">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('anime-shop');
}
