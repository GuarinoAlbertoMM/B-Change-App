// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  // opcional: stream para la UI
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private db: DatabaseService) {}

  async loadMessages(chatId: string) {
    const msgs = await this.db.getMessages(chatId);
    this.messagesSubject.next(msgs);
    return msgs;
  }

    async sendMessage(
        chatId: string,
        from: string,
        to: string,
        text: string | null,
        image: string | null,
        lat?: number | null,
        lng?: number | null
      ): Promise<void> {
        if (!this.db) {
          console.error('Database not initialized');
          return;
        }

    await this.db.addMessage(chatId, from, to, text ?? '', image ?? '', lat, lng);

    // recargar
    await this.loadMessages(chatId);
  }
}
