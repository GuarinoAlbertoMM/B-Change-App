// src/app/app.routes.ts
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog/catalog.page').then(m => m.CatalogPage),
  },
  {
    path: 'book-detail/:id',
    loadComponent: () => import('./pages/book-detail/book-detail.page').then(m => m.BookDetailPage),
  },
  {
    path: 'chat/:userId',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage),
  },
  
];
