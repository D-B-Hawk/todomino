import type { List } from "@/types";

export type CreateListArgs = Partial<Pick<List, "name" | "color" | "icon">>;

export function createList(args: CreateListArgs = {}): List {
  const { name = "reminders", color = "RED", icon = "BOX" } = args;

  const now = Date.now();

  return {
    name,
    color,
    icon,
    createdAt: now,
    updatedAt: now,
  };
}
