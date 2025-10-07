import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { CameraService } from '../../services/camera.service';
import { LocationService } from '../../services/location.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

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
  messagesSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private cameraService: CameraService,
    private locationService: LocationService,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('userId') || 'demo_chat';
    this.currentUser = await this.auth.getCurrentUser();
    await this.chatService.loadMessages(this.chatId);
    this.messagesSub = this.chatService.messages$.subscribe(m => this.messages = m);
  }

  ngOnDestroy() {
    this.messagesSub?.unsubscribe();
  }

  async sendText() {
    if (!this.newMsg.trim()) return;
    const from = this.currentUser ? this.currentUser.email : 'anon';
    await this.chatService.sendMessage(this.chatId, from, 'vendor', this.newMsg, null);
    this.newMsg = '';
  }

  async sendPhoto() {
    const imageBase64 = await this.cameraService.takePhotoAsBase64();
    if (imageBase64) {
      const from = this.currentUser ? this.currentUser.email : 'anon';
      await this.chatService.sendMessage(this.chatId, from, 'vendor', null, imageBase64);
    }
  }

  async sendLocation() {
    try {
      const loc = await this.locationService.getCurrentPosition();
      const from = this.currentUser ? this.currentUser.email : 'anon';
      await this.chatService.sendMessage(this.chatId, from, 'vendor', `Ubicación: ${loc.latitude},${loc.longitude}`, null, loc.latitude, loc.longitude);
    } catch (err) {
      alert('No se pudo obtener la ubicación: ' + err);
    }
  }
}
