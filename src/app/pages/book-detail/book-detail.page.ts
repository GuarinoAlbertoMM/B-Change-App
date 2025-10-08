import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BookService } from '../../services/book.service';
import { Book } from '../../services/models/book';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class BookDetailPage implements OnInit {
  book?: Book;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!isNaN(id)) {
      this.book = this.bookService.getById(id);
    }
  }

  goToChat() {
    if (this.book) {
      this.router.navigate(['/chat', this.book.id]);
    }
  }
}
