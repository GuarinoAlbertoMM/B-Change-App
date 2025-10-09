// src/app/pages/book-detail/book-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../services/models/book';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  styleUrls: ['./book-detail.page.scss']
})
export class BookDetailPage implements OnInit {
  book?: Book;

  constructor(
    private route: ActivatedRoute,
    private bs: BookService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('bookId');
    const id = idStr ? Number(idStr) : null;
    if (id !== null) {
      this.book = this.bs.findById(id) ?? undefined;
    }
  }

  async editBook() {
    if (!this.book) return;
    const alert = await this.alertCtrl.create({
      header: 'Editar libro',
      inputs: [
        { name: 'title', placeholder: 'Título', value: this.book.title },
        { name: 'author', placeholder: 'Autor', value: this.book.author },
        { name: 'price', placeholder: 'Precio', value: String(this.book.price ?? '') , type: 'number' },
        { name: 'description', placeholder: 'Descripción', value: this.book.description },
        { name: 'image', placeholder: 'URL imagen', value: this.book.image }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', handler: async (data) => {
            await this.bs.update(this.book!.id, {
              title: data.title,
              author: data.author,
              price: Number(data.price) || 0,
              description: data.description,
              image: data.image
            });
            const t = await this.toastCtrl.create({ message: 'Libro actualizado', duration: 1200 });
            await t.present();
            // recargar book
            this.book = this.bs.findById(this.book!.id) ?? undefined;
            return true;
        } }
      ]
    });
    await alert.present();
  }

  async deleteBook() {
    if (!this.book) return;
    const a = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Eliminar "${this.book.title}"?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí', handler: async () => {
            await this.bs.delete(this.book!.id);
            const t = await this.toastCtrl.create({ message: 'Libro eliminado', duration: 1000 });
            await t.present();
            // volver al catálogo
            this.router.navigateByUrl('/catalog', { replaceUrl: true });
        } }
      ]
    });
    await a.present();
  }
}
