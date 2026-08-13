import type { List } from "@/types";

export type CreateListArgs = Partial<Pick<List, "name" | "color" | "icon">>;

export const DEFAULT_LIST_ARGS: Required<CreateListArgs> = {
  name: "reminders",
  color: "YELLOW",
  icon: "BOX",
};

export function createList(args: CreateListArgs = {}): List {
  const {
    name = DEFAULT_LIST_ARGS.name,
    color = DEFAULT_LIST_ARGS.color,
    icon = DEFAULT_LIST_ARGS.icon,
  } = args;

  const now = Date.now();

  return {
    name,
    color,
    icon,
    createdAt: now,
    updatedAt: now,
  };
}
