// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Message } from './models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messages: Message[] = [
    {
      id: 1,
      from: 'user1',
      text: 'Hola, ¿todavía tienes el libro disponible?',
      timestamp: new Date(),
    },
    {
      id: 2,
      from: 'user2',
      text: '¡Sí! ¿Quieres verlo?',
      timestamp: new Date(),
    },
  ];
  messages$: any;
  send: any;

  constructor() {}

  getMessages(): Message[] {
    return this.messages;
  }

  sendMessage(from: string, text: string): void {
    const msg: Message = {
      id: this.messages.length + 1,
      from,
      text,
      timestamp: new Date(),
    };
    this.messages.push(msg);
  }
}
