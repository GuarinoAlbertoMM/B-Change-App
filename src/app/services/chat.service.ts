// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

export interface ChatMessage {
  id: number;
  chatId: string;
  sender: string;
  receiver: string;
  text?: string | null;
  image?: string | null; // base64 (sin prefijo) o URI según tu implementación
  latitude?: number | null;
  longitude?: number | null;
  timestamp: string;
}

const MESSAGES_KEY_PREFIX = 'bchange_messages_';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesStore: { [chatId: string]: ChatMessage[] } = {};
  private messagesSubjects: { [chatId: string]: BehaviorSubject<ChatMessage[]> } = {};

  constructor() {}

  private getStorageKey(chatId: string) {
    return `${MESSAGES_KEY_PREFIX}${chatId}`;
  }

  private ensureSubject(chatId: string) {
    if (!this.messagesSubjects[chatId]) {
      this.messagesSubjects[chatId] = new BehaviorSubject<ChatMessage[]>([]);
    }
    return this.messagesSubjects[chatId];
  }

  // Observable para la UI
  messages$(chatId: string) {
    return this.ensureSubject(chatId).asObservable();
  }

  // Carga desde Preferences al iniciar la página de chat
  async loadMessages(chatId: string) {
    const key = this.getStorageKey(chatId);
    const { value } = await Preferences.get({ key });
    const arr: ChatMessage[] = value ? JSON.parse(value) : [];
    this.messagesStore[chatId] = arr;
    this.ensureSubject(chatId).next(arr.slice());
    return arr;
  }

  // Persistir localmente
  private async persist(chatId: string) {
    const key = this.getStorageKey(chatId);
    const arr = this.messagesStore[chatId] ?? [];
    await Preferences.set({ key, value: JSON.stringify(arr) });
  }

  // Enviar mensaje (texto / foto / ubicación)
  async sendMessage(
    chatId: string,
    sender: string,
    receiver: string,
    text: string | null,
    image: string | null,
    latitude?: number | null,
    longitude?: number | null
  ): Promise<ChatMessage> {
    const arr = this.messagesStore[chatId] ?? [];
    const message: ChatMessage = {
      id: Date.now(),
      chatId,
      sender,
      receiver,
      text: text ?? null,
      image: image ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      timestamp: new Date().toISOString()
    };
    arr.push(message);
    this.messagesStore[chatId] = arr;
    this.ensureSubject(chatId).next(arr.slice());
    await this.persist(chatId);
    return message;
  }

  // Opcional: obtener mensajes actuales sin observable
  getCachedMessages(chatId: string): ChatMessage[] {
    return (this.messagesStore[chatId] ?? []).slice();
  }
}
