import { IconKey } from "../constants";
import type { List } from "../types";

type CreateListArgs = Partial<Pick<List, "name" | "color" | "icon">>;

export function createList(args: CreateListArgs = {}): List {
  const { name = "reminders", color = "#eb3d34", icon = IconKey.BOX } = args;

  const now = Date.now();

  return {
    name,
    color,
    icon,
    createdAt: now,
    updatedAt: now,
  };
}
