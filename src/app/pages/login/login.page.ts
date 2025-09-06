import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  email = '';
  password = '';
  constructor(private router: Router) {}

  login() {
    if (this.email && this.password) {
      this.router.navigateByUrl('/catalog');
    } else {
      alert('Ingrese correo y contraseña');
    }
  }
}
