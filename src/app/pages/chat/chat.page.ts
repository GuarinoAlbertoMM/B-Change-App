import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ChatService } from '../../services/chat.service';
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
  chatId = '';
  messages: any[] = [];
  newMsg = '';
  currentUser: any = null;
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
    this.currentUser = await this.auth.getCurrentUser();
    await this.chatService.loadMessages(this.chatId);
    this.sub = this.chatService.messages$.subscribe(m => this.messages = m.slice()); // copia para evitar referencia directa
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  // Enviar texto: mostramos localmente primero para respuesta instantánea
  async sendText() {
    const from = this.currentUser?.email ?? 'anon';
    const text = this.newMsg.trim();
    if (!text) return;

    const localMsg = {
      chatId: this.chatId,
      sender: from,
      receiver: 'vendor',
      text,
      image: null,
      latitude: null,
      longitude: null,
      timestamp: new Date().toISOString()
    };

    // push local para visualización inmediata
    this.messages = [...this.messages, localMsg];

    // guardar en BD de fondo
    try {
      await this.chatService.sendMessage(this.chatId, from, 'vendor', text, null, null, null);
    } catch (err) {
      console.error('Error guardando mensaje', err);
      // opcional: mostrar alerta y/o eliminar mensaje local
    }

    this.newMsg = '';
  }

  // Tomar foto y enviar: visualiza inmediatamente
  async sendPhoto() {
    const from = this.currentUser?.email ?? 'anon';
    const base64 = await this.cameraService.takePhotoAsBase64();
    if (!base64) {
      const a = await this.alertCtrl.create({ header: 'Foto', message: 'No se tomó la foto.', buttons: ['OK'] });
      await a.present();
      return;
    }

    const localMsg = {
      chatId: this.chatId,
      sender: from,
      receiver: 'vendor',
      text: null,
      image: base64,
      latitude: null,
      longitude: null,
      timestamp: new Date().toISOString()
    };

    this.messages = [...this.messages, localMsg];

    try {
      await this.chatService.sendMessage(this.chatId, from, 'vendor', null, base64, null, null);
    } catch (err) {
      console.error('Error guardando foto', err);
    }
  }

  // Enviar ubicación (se visualiza como texto con lat/lng)
  async sendLocation() {
    const from = this.currentUser?.email ?? 'anon';
    const pos = await this.locationService.getCurrentPosition();
    if (!pos) {
      const a = await this.alertCtrl.create({ header: 'Ubicación', message: 'No se pudo obtener la ubicación.', buttons: ['OK'] });
      await a.present();
      return;
    }
    const text = `Ubicación: ${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}`;

    const localMsg = {
      chatId: this.chatId,
      sender: from,
      receiver: 'vendor',
      text,
      image: null,
      latitude: pos.latitude,
      longitude: pos.longitude,
      timestamp: new Date().toISOString()
    };

    this.messages = [...this.messages, localMsg];

    try {
      await this.chatService.sendMessage(this.chatId, from, 'vendor', text, null, pos.latitude, pos.longitude);
    } catch (err) {
      console.error('Error guardando ubicación', err);
    }
  }
}
