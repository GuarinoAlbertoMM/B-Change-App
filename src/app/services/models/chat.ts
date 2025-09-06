import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Chat {
  
}
export interface Message {
  id: number;
  from: string;      // usuario que envía
  text: string;      // contenido del mensaje
  timestamp: Date;   // hora/fecha
}
