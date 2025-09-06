import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,              // 👈 le dices a Angular que es standalone
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {}

