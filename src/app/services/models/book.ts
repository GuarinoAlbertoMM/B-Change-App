import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Book {
  
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  color: string; // agregado: opcional para usar como fondo/thumbnail
}
