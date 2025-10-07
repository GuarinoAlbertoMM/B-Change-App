import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqliteConnection: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  }

  // Inicializa la base de datos y crea la tabla si no existe
  async initializeDatabase() {
    try {
      // Crear o abrir la conexión
      this.db = await this.sqliteConnection.createConnection(
        'bchange_db',      // nombre de la base de datos
        false,             // no en modo encriptado
        'no-encryption',   // tipo de encriptación
        1,                 // versión
        false              // modo de lectura (false = lectura/escritura)
      );

      // Abrir la conexión
      await this.db.open();

      // Crear la tabla de usuarios, si no existe
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT
        );
      `;
      // Crear tabla de mensajes
      const createChatTableQuery = `
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chatId TEXT,
          sender TEXT,
          receiver TEXT,
          text TEXT,
          image TEXT,
          latitude REAL,
          longitude REAL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await this.db.execute(createChatTableQuery);

      await this.db.execute(createTableQuery);

      console.log('✅ Base de datos inicializada correctamente');
    } catch (err) {
      console.error('❌ Error inicializando la base de datos:', err);
    }
  }

  // Insertar usuario
  async addUser(name: string, email: string, password: string) {
    if (!this.db) {
      console.error('La base de datos no está inicializada');
      return;
    }
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?);`;
    await this.db.run(query, [name, email, password]);
  }

  // Obtener usuario por email
  async getUserByEmail(email: string) {
  if (!this.db) return null;
  const query = `SELECT * FROM users WHERE email = ?;`;
  const result = await this.db.query(query, [email]);
  return result.values?.[0] || null;
}

  // Cerrar conexión (opcional)
  async closeConnection() {
    if (this.db) {
      await this.sqliteConnection.closeConnection('bchange_db', false);
      this.db = null;
    }
  }

  // Obtener mensajes por chatId
  async getMessages(chatId: string) {
    if (!this.db) return [];
    const query = `SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC;`;
    const result = await this.db.query(query, [chatId]);
    return result.values || [];
  }

  // Agregar mensaje
  async addMessage(
    chatId: string,
    from: string,
    to: string,
    text: string = '',
    image: string = '',
    lat?: number | null,
    lng?: number | null
  ): Promise<void> {
    if (!this.db) {
      console.error('Database not connected');
      return;
    }

    const query = `
      INSERT INTO messages (chat_id, sender, receiver, text, image, lat, lng, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [chatId, from, to, text, image, lat ?? null, lng ?? null, new Date().toISOString()];
    await this.db.run(query, values);
    }

}
