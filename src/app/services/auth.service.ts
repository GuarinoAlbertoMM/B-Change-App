// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

const USERS_KEY = 'bchange_users';
const CURRENT_USER_KEY = 'bchange_current_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  private async getUsers(): Promise<User[]> {
    const { value } = await Preferences.get({ key: USERS_KEY });
    return value ? JSON.parse(value) as User[] : [];
  }

  private async saveUsers(users: User[]) {
    await Preferences.set({ key: USERS_KEY, value: JSON.stringify(users) });
  }

  // crear usuario de prueba si no existe
  async ensureTestAdmin(): Promise<User> {
    const users = await this.getUsers();
    const found = users.find(u => u.email === 'adminprueba@gmail.com');
    if (found) return found;
    const admin: User = {
      id: Date.now(),
      name: 'Admin Prueba',
      email: 'adminprueba@gmail.com',
      password: 'Admin.123',
      role: 'admin'
    };
    users.push(admin);
    await this.saveUsers(users);
    return admin;
  }

  async register(name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<User> {
    const users = await this.getUsers();
    if (users.find(u => u.email === email)) throw new Error('Ya existe un usuario con ese correo');
    const newUser: User = { id: Date.now(), name, email, password, role };
    users.push(newUser);
    await this.saveUsers(users);
    await Preferences.set({ key: CURRENT_USER_KEY, value: JSON.stringify(newUser) });
    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Usuario no encontrado');
    if (user.password !== password) throw new Error('Contraseña incorrecta');
    await Preferences.set({ key: CURRENT_USER_KEY, value: JSON.stringify(user) });
    return user;
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: CURRENT_USER_KEY });
  }

  async getCurrentUser(): Promise<User | null> {
    const { value } = await Preferences.get({ key: CURRENT_USER_KEY });
    return value ? JSON.parse(value) as User : null;
  }
}
