// services/sqliteItemRepository.ts

import * as SQLite from "expo-sqlite";
import { Item, ITEM_TABLE_SQL } from "../models/item";

export class SQLiteItemRepository {
  private db: SQLite.SQLiteDatabase;

  // Constructor is private — we don't want anyone accidentally creating
  // this with `new SQLiteItemRepository()` before the table exists.
  // Everyone must go through init() instead.
  private constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }

  // The only proper way to get an instance of this class.
  static async init(): Promise<SQLiteItemRepository> {
    const db = await SQLite.openDatabaseAsync("resurface.db");
    await db.execAsync(ITEM_TABLE_SQL);
    console.log("Database initialized, items table ready");
    return new SQLiteItemRepository(db);
  }

  async create(input: {
    type: "link" | "text" | "image";
    content: string;
    title: string | null;
    intent: "read" | "watch" | "try" | "reference";
    status: "inbox" | "scheduled" | "done" | "archived";
    scheduledAt: string | null;
  }): Promise<Item> {
    const id = Date.now().toString(); // simple unique-enough id for now
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO items (id, type, content, title, intent, status, scheduled_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.type,
        input.content,
        input.title,
        input.intent,
        input.status,
        input.scheduledAt,
        now,
        now,
      ],
    );

    return { ...input, id, createdAt: now, updatedAt: now };
  }

  async listAll(): Promise<Item[]> {
    const rows = await this.db.getAllAsync<any>(`SELECT * FROM items`);

    // SQLite gives back snake_case column names (scheduled_at, created_at)
    // — we convert to our camelCase Item shape here, in one place, so the
    // rest of the app never has to think about that mismatch.
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      content: row.content,
      title: row.title,
      intent: row.intent,
      status: row.status,
      scheduledAt: row.scheduled_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
  async updateStatus(
    id: string,
    status: "inbox" | "scheduled" | "done" | "archived",
  ): Promise<void> {
    await this.db.runAsync(
      `UPDATE items SET status = ?, updated_at = ? WHERE id = ?`,
      [status, new Date().toISOString(), id],
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync(`DELETE FROM items WHERE id = ?`, [id]);
  }
}
