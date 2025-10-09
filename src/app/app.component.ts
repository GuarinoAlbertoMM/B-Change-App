// src/app/app.component.ts
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  constructor(private auth: AuthService) {
    this.init();
  }

  private async init() {
    try {
      await this.auth.ensureTestAdmin();
      console.log('Usuario de prueba presente');
    } catch (err) {
      console.warn('No se pudo crear usuario de prueba', err);
    }
  }
}
