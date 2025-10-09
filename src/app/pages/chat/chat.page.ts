// src/app/pages/chat/chat.page.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonicModule, IonContent, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ChatService, ChatMessage } from '../../services/chat.service';
import { CameraService } from '../../services/camera.service';
import { LocationService } from '../../services/location.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content!: IonContent;

  chatId = '';
  messages: ChatMessage[] = [];
  newMsg = '';
  currentUserEmail = '';
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private cameraService: CameraService,
    private locationService: LocationService,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('userId') || 'demo_chat';
    const u = await this.auth.getCurrentUser();
    this.currentUserEmail = u?.email ?? 'anon';

    await this.chatService.loadMessages(this.chatId);
    // subscribe
    this.sub = this.chatService.messages$(this.chatId).subscribe(ms => {
      this.messages = ms;
      // small delay to let DOM render then scroll
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private async scrollToBottom() {
    try {
      await this.content.scrollToBottom(300);
    } catch (e) { /* ignore */ }
  }

  // Enviar texto
  async sendText() {
    const text = this.newMsg.trim();
    if (!text) return;
    // llama al servicio (persistirá y actualizará el observable)
    await this.chatService.sendMessage(this.chatId, this.currentUserEmail, 'vendor', text, null, null, null);
    this.newMsg = '';
    // scroll será llamado por el subscriber
  }

  // Tomar foto y enviar (base64)
  async sendPhoto() {
    const base64 = await this.cameraService.takePhotoAsBase64();
    if (!base64) {
      const a = await this.alertCtrl.create({ header: 'Foto', message: 'No se tomó la foto.', buttons: ['OK'] });
      await a.present();
      return;
    }
    await this.chatService.sendMessage(this.chatId, this.currentUserEmail, 'vendor', null, base64, null, null);
  }

  // Enviar ubicación
  async sendLocation() {
    const pos = await this.locationService.getCurrentPosition();
    if (!pos) {
      const a = await this.alertCtrl.create({ header: 'Ubicación', message: 'No se pudo obtener la ubicación.', buttons: ['OK'] });
      await a.present();
      return;
    }
    const text = `Ubicación: ${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}`;
    await this.chatService.sendMessage(this.chatId, this.currentUserEmail, 'vendor', text, null, pos.latitude, pos.longitude);
  }
}
