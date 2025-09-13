import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from './layout/header/header';
import { AssistantChatComponent } from './components/assistant-chat/assistant-chat';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Sidebar, Header, AssistantChatComponent],
	template: `
		<a class="skip-link" href="#main-content">Bỏ qua tới nội dung</a>
		<div class="app-shell">
			<app-sidebar></app-sidebar>
			<div class="app-main">
				<app-header></app-header>
				<div class="page-container" id="main-content">
					<router-outlet />
				</div>
			</div>
			<app-assistant-chat></app-assistant-chat>
		</div>
	`,
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('kurumianimeshop');
}
