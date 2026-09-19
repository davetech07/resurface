// models/item.ts

export type ItemType = "link" | "text" | "image";
export type ItemStatus = "inbox" | "scheduled" | "done" | "archived";
export type Intent = "read" | "watch" | "try" | "reference";

export interface Item {
  id: string;
  type: ItemType;
  content: string; // URL for link, body text for text, file path for image
  title: string | null;
  intent: Intent;
  status: ItemStatus;
  scheduledAt: string | null; // ISO date string, e.g. "2026-09-20T20:00:00.000Z"
  createdAt: string;
  updatedAt: string;
}

// This is the "shape" from the TypeScript interface above, translated
// into SQL's own language. Notice the columns line up 1-to-1 with the
// fields in Item — that's intentional, it keeps the two in sync.
export const ITEM_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('link','text','image')),
    content TEXT NOT NULL,
    title TEXT,
    intent TEXT NOT NULL DEFAULT 'read',
    status TEXT NOT NULL DEFAULT 'scheduled',
    scheduled_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;
