// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../services/models/book';

const BOOKS_KEY = 'bchange_books';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books$ = new BehaviorSubject<Book[]>([]);
  booksObservable = this.books$.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private async loadFromStorage() {
    const { value } = await Preferences.get({ key: BOOKS_KEY });
    const arr: Book[] = value ? JSON.parse(value) : [];
    this.books$.next(arr);
  }

  private async saveToStorage(arr: Book[]) {
    await Preferences.set({ key: BOOKS_KEY, value: JSON.stringify(arr) });
    this.books$.next(arr);
  }

  async getAll(): Promise<Book[]> {
    return this.books$.getValue();
  }

  async add(book: Omit<Book,'id'>): Promise<Book> {
    const arr = this.books$.getValue();
    const id = arr.length ? Math.max(...arr.map(b => b.id)) + 1 : 1;
    const newBook: Book = { id, ...book };
    arr.push(newBook);
    await this.saveToStorage(arr);
    return newBook;
  }

  async update(id: number, patch: Partial<Book>): Promise<Book | null> {
    const arr = this.books$.getValue();
    const idx = arr.findIndex(b => b.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch };
    await this.saveToStorage(arr);
    return arr[idx];
  }

  async delete(id: number): Promise<void> {
    let arr = this.books$.getValue();
    arr = arr.filter(b => b.id !== id);
    await this.saveToStorage(arr);
  }

  // helper: find by id
  findById(id: number): Book | undefined {
    return this.books$.getValue().find(b => b.id === id);
  }
}
