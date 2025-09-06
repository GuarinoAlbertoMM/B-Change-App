import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  imports: [CommonModule, FormsModule, IonicModule], // 👈 Agregamos FormsModule
  standalone: true,
})
export class CatalogPage {
  query: string = '';   // 👈 Solución: definimos la propiedad query
  books = this.bookService.getBooks();

  constructor(private bookService: BookService) {}

  // ✅ Función para filtrar los libros
  filteredBooks() {
    return this.books.filter(book =>
      book.title.toLowerCase().includes(this.query.toLowerCase())
    );
  }

  // ✅ Ejemplo de método add
  add() {
    alert('Agregar un nuevo libro (función por implementar)');
  }
}
