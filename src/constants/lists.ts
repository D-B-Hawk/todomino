import { z } from "zod/v4";
import type { IconKey } from "./icons";
import type { PickerColor } from "./colors";

export const READONLY_LIST_NAMES = ["completed", "todomino", "today"] as const;

export const MAIN_LIST_NAMES = ["reminders"] as const;

export const INITIAL_LIST_NAMES = [
  ...READONLY_LIST_NAMES,
  ...MAIN_LIST_NAMES,
] as const;

export const LIST_ACTION = ["ADD_LIST", "DELETE_LIST"] as const;

export type ReadOnlyListName = (typeof READONLY_LIST_NAMES)[number];
export type MainListName = (typeof MAIN_LIST_NAMES)[number];
export type ListAction = (typeof LIST_ACTION)[number];

export type ListName = MainListName | ReadOnlyListName | (string & {});

export type List = {
  name: ListName;
  color: PickerColor;
  icon: IconKey;
  createdAt: number;
  updatedAt: number;
};

export const LIST_UNION = z.union([
  z.enum(INITIAL_LIST_NAMES),
  z.string().min(1),
]);

export const INITIAL_LISTS_MAP: Record<ListName, List> = {
  completed: {
    name: "completed",
    icon: "CHECK",
    color: "SLATE_GREY",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  reminders: {
    name: "reminders",
    icon: "DATABASE",
    color: "YELLOW",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  today: {
    name: "today",
    icon: "CLOCK",
    color: "BLUE",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  todomino: {
    name: "todomino",
    icon: "BOX",
    color: "PURPLE",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const INITIAL_LISTS = Object.values(INITIAL_LISTS_MAP);
