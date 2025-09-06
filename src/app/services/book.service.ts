// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { Book } from './models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private books: Book[] = [
    {
      id: 1,
      title: 'Introducción a Ionic',
      author: 'Juan Pérez',
      description: 'Guía práctica para comenzar con Ionic y Angular.',
      price: 25,
      image: 'assets/images/book1.jpg',
    },
    {
      id: 2,
      title: 'Angular Avanzado',
      author: 'María Gómez',
      description: 'Patrones y buenas prácticas con Angular.',
      price: 30,
      image: 'assets/images/book2.jpg',
    },
    {
      id: 3,
      title: 'Desarrollo Móvil con Capacitor',
      author: 'Carlos López',
      description: 'Cómo integrar Capacitor en tus proyectos Ionic.',
      price: 28,
      image: 'assets/images/book3.jpg',
    },
  ];
  getAll: any;
  openDetail: any;
  getById: any;

  constructor() {}

  getBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find((b) => b.id === id);
  }
}
