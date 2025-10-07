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
  name = '';      // para registro
  isRegister = false;

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    private router: Router
  ) {
    // inicializar DB si no se hizo
    this.db.init().catch(err => console.warn('DB init failed', err));
  }

  async submit() {
    try {
      if (this.isRegister) {
        await this.auth.register(this.email, this.name, this.password);
      } else {
        await this.auth.login(this.email, this.password);
      }
      // ir al catálogo
      this.router.navigateByUrl('/catalog');
    } catch (err: any) {
      alert(err.message || err);
    }
  }
}
