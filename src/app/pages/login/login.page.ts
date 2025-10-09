// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  email = '';
  password = '';
  isRegister = false;
  name = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async submit() {
    if (!this.isValidEmail(this.email)) return alert('Email inválido');
    if (!this.password || this.password.length < 4) return alert('Contraseña debe tener al menos 4 caracteres');

    this.loading = true;
    try {
      if (this.isRegister) {
        if (!this.name) throw new Error('Ingresa tu nombre');
        await this.auth.register(this.name, this.email, this.password, 'user');
        alert('Registro correcto. Se inició sesión.');
      } else {
        await this.auth.login(this.email, this.password);
        alert('Inicio de sesión correcto');
      }
      await this.router.navigateByUrl('/catalog', { replaceUrl: true });
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      this.loading = false;
    }
  }
}
