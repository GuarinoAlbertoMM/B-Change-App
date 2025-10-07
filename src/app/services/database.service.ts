// src/app/services/database.service.ts
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db: SQLiteDBConnection | null = null;
  private dbName = 'bchange_db';

  constructor() {}

  // inicializa la DB (llamar en app init o antes de usarla)
  public async init() {
    try {
      // crea conexión
      this.db= await CapacitorSQLite.createConnection({ database: this.dbName, version: 1 });
      if (!this.db) throw new Error('Failed to create DB connection');
      await this.db.open();
      // ejecutar esquema
      const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          name TEXT,
          password TEXT
        );
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chat_id TEXT,
          from_user TEXT,
          to_user TEXT,
          text TEXT,
          image TEXT,
          latitude REAL,
          longitude REAL,
          timestamp INTEGER
        );
      `;
      await this.db.execute(sql);
      await CapacitorSQLite.closeConnection({ database: this.dbName });
    } catch (err) {
      console.error('DB init error', err);
      // Fallback: en web, el plugin ofrece implementación en IndexedDB internamente
    }
  }

  // ejecutar query genérico
  public async run(query: string, values: any[] = []) {
    if (!this.db) throw new Error('DB not initialized');
    const res = await this.db!.run(query, values);
    return res;
  }

  // Helpers de usuario y mensajes
  public async addUser(email: string, name: string, password: string) {
    const q = `INSERT INTO users (email, name, password) VALUES (?, ?, ?)`;
    return this.run(q, [email, name, password]);
  }

  public async getUserByEmail(email: string) {
    const q = `SELECT * FROM users WHERE email = ?`;
    const r: any = await this.run(q, [email]);
    // res.rows may vary según versión; plugin devuelve 'values' o 'rows'
    return (r && r.values && r.values.length) ? r.values[0] : undefined;
  }

  public async addMessage(chatId: string, from: string, to: string, text: string | null, image: string | null, lat?: number, lng?: number) {
    const ts = Date.now();
    const q = `INSERT INTO messages (chat_id, from_user, to_user, text, image, latitude, longitude, timestamp)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return this.run(q, [chatId, from, to, text, image, lat ?? null, lng ?? null, ts]);
  }

  public async getMessages(chatId: string) {
    const q = `SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`;
    const r: any = await this.run(q, [chatId]);
    return (r && r.values) ? r.values : [];
  }
}
