import { z } from "zod/v4";
import type { IconKey } from "./icons";
import type { PickerColor } from "./colors";

export const READONLY_LIST_NAMES = ["completed", "todomino", "today"] as const;

export const MAIN_LIST_NAMES = ["reminders"] as const;

export const INITIAL_LIST_NAMES = [
  ...READONLY_LIST_NAMES,
  ...MAIN_LIST_NAMES,
] as const;

export type ReadOnlyListName = (typeof READONLY_LIST_NAMES)[number];
export type MainListName = (typeof MAIN_LIST_NAMES)[number];

export type ListName = MainListName | ReadOnlyListName | (string & {});

export const LIST_UNION = z.union([
  z.enum(INITIAL_LIST_NAMES),
  z.string().min(1),
]);

export const LIST_INFO_MAP: Record<
  ListName,
  { icon: IconKey; color: PickerColor }
> = {
  completed: { icon: "CHECK", color: "SLATE_GREY" },
  reminders: { icon: "DATABASE", color: "YELLOW" },
  today: { icon: "CLOCK", color: "BLUE" },
  todomino: { icon: "BOX", color: "PURPLE" },
};
