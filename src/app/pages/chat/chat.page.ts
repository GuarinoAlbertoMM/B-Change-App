import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../services/models/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit {
  messages: Message[] = [];
  newMsg = '';
  userId = '';
  constructor(private cs: ChatService, private route: ActivatedRoute) {}

  ngOnInit(){
    this.userId = this.route.snapshot.paramMap.get('userId') || 'vendedor';
    this.cs.messages$.subscribe((m: Message[]) => this.messages = m);
  }

  send(){
    if(!this.newMsg) return;
    this.cs.send(this.userId, this.newMsg);
    this.newMsg = '';
  }
}
