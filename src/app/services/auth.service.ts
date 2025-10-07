// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserKey = 'bchange_current_user';

  constructor(private db: DatabaseService) {}

  async register(email: string, name: string, password: string) {
    // simple: no hashing; puedes añadir hash si quieres
    await this.db.addUser(email, name, password);
    const user = await this.db.getUserByEmail(email);
    await Preferences.set({ key: this.currentUserKey, value: JSON.stringify(user) });
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.db.getUserByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');
    if (user.password !== password) throw new Error('Contraseña incorrecta');
    await Preferences.set({ key: this.currentUserKey, value: JSON.stringify(user) });
    return user;
  }

  async logout() {
    await Preferences.remove({ key: this.currentUserKey });
  }

  async getCurrentUser() {
    const ret = await Preferences.get({ key: this.currentUserKey });
    return ret.value ? JSON.parse(ret.value) : null;
  }
}
