import { Injectable } from '@angular/core';
import { Book } from '../services/models/book';

@Injectable({ providedIn: 'root' })
export class BookService {
  private books: Book[] = [
    { id: 1, title: 'Introducción a Ionic', author: 'Juan Pérez', description: 'Guía práctica', price: 25, image: 'assets/images/book1.jpg', color: '#2f6fb3' },
    { id: 2, title: 'Angular Avanzado', author: 'María Gómez', description: 'Patrones', price: 30, image: 'assets/images/book2.jpg', color: '#3fa78a' }
  ];

  getAll() { return this.books.slice(); }

  getById(id: number) { return this.books.find(b => b.id === id); }

  add(book: Omit<Book, 'id'>) {
    const id = this.books.length ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
    const newBook: Book = { id, ...book };
    this.books.push(newBook);
    return newBook;
  }

  update(id: number, patch: Partial<Book>) {
    const idx = this.books.findIndex(b => b.id === id);
    if (idx < 0) return null;
    this.books[idx] = { ...this.books[idx], ...patch };
    return this.books[idx];
  }

  delete(id: number) {
    this.books = this.books.filter(b => b.id !== id);
  }
}
