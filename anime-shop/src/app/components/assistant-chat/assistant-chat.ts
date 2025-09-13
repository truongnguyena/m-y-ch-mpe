import { Component, effect } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService } from '../../services/assistant';

@Component({
	selector: 'app-assistant-chat',
	imports: [NgFor, NgClass, FormsModule],
	template: `
	  <div class="assistant" [class.open]="open">
	    <button class="fab" (click)="toggle()">AI</button>
	    <div class="panel">
	      <div class="header">
	        <strong>Trợ lý AI</strong>
	        <button class="clear" (click)="clear()">Xoá</button>
	      </div>
	      <div class="messages">
	        <div class="msg" *ngFor="let m of svc.messages()" [class.user]="m.role==='user'" [class.assistant]="m.role==='assistant'">
	          <span>{{ m.text }}</span>
	        </div>
	      </div>
	      <form class="input" (ngSubmit)="send()" #f="ngForm">
	        <input name="text" [(ngModel)]="draft" placeholder="Hỏi mình bất cứ điều gì..." />
	        <button>Gửi</button>
	      </form>
	    </div>
	  </div>
	`,
	styles: `
	  .assistant { position: fixed; right: 20px; bottom: 20px; z-index: 50; }
	  .fab { width: 56px; height: 56px; border-radius: 50%; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); box-shadow: 0 8px 24px rgba(255,79,163,.35); font-weight: 800; }
	  .panel { display: none; width: 320px; height: 440px; background: rgba(30,20,48,.95); border: 1px solid rgba(255,255,255,.12); border-radius: 16px; overflow: hidden; backdrop-filter: blur(6px); }
	  .assistant.open .panel { display: grid; grid-template-rows: auto 1fr auto; }
	  .header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,.12); }
	  .messages { padding: 10px; overflow: auto; display: grid; gap: 8px; }
	  .msg { max-width: 80%; padding: 8px 10px; border-radius: 10px; background: rgba(255,255,255,.06); }
	  .msg.user { justify-self: end; background: linear-gradient(135deg, rgba(255,79,163,.35), rgba(138,92,255,.35)); }
	  .msg.assistant { justify-self: start; }
	  .input { display: flex; gap: 8px; padding: 10px; border-top: 1px solid rgba(255,255,255,.12); }
	  input { flex: 1; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.06); color: #fff; }
	  .clear, .input button { padding: 8px 10px; border-radius: 10px; border: 0; color: #fff; background: linear-gradient(135deg, var(--pink-500), var(--purple-600)); }
	`
})
export class AssistantChatComponent {
	open = false;
	draft = '';

	constructor(public readonly svc: AssistantService) {
		effect(() => {
			// Scroll to bottom on new messages
			this.svc.messages();
			queueMicrotask(() => {
				const el = document.querySelector('.assistant .messages');
				if (el) el.scrollTop = el.scrollHeight;
			});
		});
	}

	toggle() { this.open = !this.open; }
	clear() { this.svc.clear(); }
	send() { const t = this.draft.trim(); if (t) { this.svc.sendUserMessage(t); this.draft = ''; } }
}
