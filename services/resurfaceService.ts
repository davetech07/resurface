// services/resurfaceService.ts

import { Intent, Item, ItemType } from "../models/item";
import {
  cancelItemNotification,
  scheduleItemNotification,
} from "./notifications";
import { SQLiteItemRepository } from "./sqliteItemRepository";

export class ResurfaceService {
  constructor(private repo: SQLiteItemRepository) {}

  /**
   * This is the ONE rule we already decided matters: every captured item
   * must have a real review date — no silent fallback. If the UI ever
   * tries to skip it, this throws instead of quietly saving a broken item.
   */
  async captureItem(input: {
    type: ItemType;
    content: string;
    title?: string;
    intent?: Intent;
    scheduledAt: string;
  }): Promise<Item> {
    if (!input.content || input.content.trim().length === 0) {
      throw new Error("Content is required to capture an item.");
    }
    if (!input.scheduledAt) {
      throw new Error("A review date is required to capture an item.");
    }

    const item = await this.repo.create({
      type: input.type,
      content: input.content,
      title: input.title ?? null,
      intent: input.intent ?? "read",
      status: "scheduled",
      scheduledAt: input.scheduledAt,
    });

    await scheduleItemNotification(
      item.id,
      item.title ?? item.content,
      item.scheduledAt!,
    );

    return item;
  }

  async markDone(itemId: string): Promise<void> {
    await this.repo.updateStatus(itemId, "done");
    await cancelItemNotification(itemId);
  }

  async archive(itemId: string): Promise<void> {
    await this.repo.updateStatus(itemId, "archived");
    await cancelItemNotification(itemId);
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.repo.delete(itemId);
    await cancelItemNotification(itemId);
  }

  async getAllItems(): Promise<Item[]> {
    return this.repo.listAll();
  }
}
