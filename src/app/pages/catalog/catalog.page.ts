import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, IonItemSliding, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../services/models/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CatalogPage implements OnInit {
  books: Book[] = [];

  constructor(private bs: BookService, private alertCtrl: AlertController, private toastCtrl: ToastController, private router: Router) {}

  ngOnInit() { this.load(); }

  load() { this.books = this.bs.getAll(); }

  open(book: Book) { this.router.navigate(['/book-detail', book.id]); }

  async add() {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo libro',
      inputs: [
        { name: 'title', placeholder: 'Título' },
        { name: 'author', placeholder: 'Autor' },
        { name: 'price', placeholder: 'Precio', type: 'number' },
        { name: 'description', placeholder: 'Descripción' },
        { name: 'image', placeholder: 'Ruta imagen (opcional)' },
        { name: 'color', placeholder: 'Color hex (opcional)', value: '#f0a63f' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Agregar', handler: (data) => {
            if (!data.title || !data.author) return false;
            this.bs.add({
              title: data.title,
              author: data.author,
              price: Number(data.price) || 0,
              description: data.description || '',
              image: data.image || 'assets/images/book-default.jpg',
              color: data.color || '#ccc'
            });
            this.load();
            this.toast('Libro agregado');
            return true;
          }
        }
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
        { name: 'price', placeholder: 'Precio', value: String(book.price), type: 'number' },
        { name: 'description', placeholder: 'Descripción', value: book.description },
        { name: 'image', placeholder: 'Ruta imagen', value: book.image },
        { name: 'color', placeholder: 'Color', value: book.color }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', handler: (data) => {
            this.bs.update(book.id, {
              title: data.title,
              author: data.author,
              price: Number(data.price) || 0,
              description: data.description,
              image: data.image,
              color: data.color
            });
            this.load();
            this.toast('Libro actualizado');
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmDelete(book: Book, sliding?: IonItemSliding) {
    sliding?.close();
    const a = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Eliminar "${book.title}"?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', handler: () => {
            this.bs.delete(book.id);
            this.load();
            this.toast('Libro eliminado');
          } }
      ]
    });
    await a.present();
  }

  async toast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1200 });
    await t.present();
  }
}
