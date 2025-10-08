import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  name = '';
  isRegister = false;
  loading = false;

  constructor(private auth: AuthService, private db: DatabaseService, private router: Router) {
    this.db.initializeDatabase().catch(() => {});
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async submit() {
    if (!this.isValidEmail(this.email)) return alert('Email inválido');
    if (!this.password || this.password.length < 4) return alert('Contraseña mínima 4 caracteres');

    this.loading = true;
    try {
      if (this.isRegister) {
        if (!this.name) throw new Error('Ingresa tu nombre');
        await this.auth.register(this.name, this.email, this.password);
        alert('Registro exitoso');
      } else {
        await this.auth.login(this.email, this.password);
        alert('Login correcto');
      }
      this.router.navigateByUrl('/catalog', { replaceUrl: true });
    } catch (err: any) {
      alert(err?.message || 'Error');
    } finally {
      this.loading = false;
    }
  }
}
