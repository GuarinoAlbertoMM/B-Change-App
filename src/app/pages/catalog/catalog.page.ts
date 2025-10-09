// src/app/pages/catalog/catalog.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { IonItemSliding } from '@ionic/angular';
import { Book } from '../../services/models/book';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  styleUrls: ['./catalog.page.scss']
})
export class CatalogPage implements OnInit {
  books: Book[] = [];
  currentUserEmail = '';

  constructor(
    private bs: BookService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    const u = await this.auth.getCurrentUser();
    this.currentUserEmail = u?.email ?? '';
    // suscribirse a cambios
    this.bs.booksObservable.subscribe(arr => this.books = arr);
    // cargar initial
    const all = await this.bs.getAll();
    this.books = all;
  }

  openDetail(book: Book) {
    this.router.navigate(['/book-detail', book.id]);
  }

  async add() {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo libro',
      inputs: [
        { name: 'title', placeholder: 'Título' },
        { name: 'author', placeholder: 'Autor' },
        { name: 'price', placeholder: 'Precio', type: 'number' },
        { name: 'description', placeholder: 'Descripción' },
        { name: 'image', placeholder: 'URL imagen (opcional)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Agregar', handler: async (data) => {
            if (!data.title || !data.author) return false;
            await this.bs.add({
              title: data.title,
              author: data.author,
              price: Number(data.price) || 0,
              description: data.description || '',
              image: data.image || 'assets/images/book-default.jpg',
              color: '#ddd',
              adminEmail: this.currentUserEmail
            });
            const t = await this.toastCtrl.create({ message: 'Libro agregado', duration: 1200 });
            await t.present();
            return true;
        } }
      ]
    });
    await alert.present();
  }

  async edit(book: Book, sliding?: IonItemSliding) {
    sliding?.close();
    const alert = await this.alertCtrl.create({
      header: 'Editar libro',
      inputs: [
        { name: 'title', placeholder: 'Título', value: book.title },
        { name: 'author', placeholder: 'Autor', value: book.author },
        { name: 'price', placeholder: 'Precio', type: 'number', value: String(book.price ?? '') },
        { name: 'description', placeholder: 'Descripción', value: book.description },
        { name: 'image', placeholder: 'URL imagen', value: book.image }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', handler: async (data) => {
            await this.bs.update(book.id, {
              title: data.title,
              author: data.author,
              price: Number(data.price) || 0,
              description: data.description,
              image: data.image
            });
            const t = await this.toastCtrl.create({ message: 'Libro actualizado', duration: 1200 });
            await t.present();
            return true;
        } }
      ]
    });
    await alert.present();
  }

  async confirmDelete(book: Book, sliding?: IonItemSliding) {
    sliding?.close();
    const a = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Eliminar "${book.title}"?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', handler: async () => {
            await this.bs.delete(book.id);
            const t = await this.toastCtrl.create({ message: 'Libro eliminado', duration: 1000 });
            await t.present();
        } }
      ]
    });
    await a.present();
  }
}
