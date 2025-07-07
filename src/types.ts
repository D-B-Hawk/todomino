import type { DOMElement } from "solid-js/jsx-runtime";
import {
  IconKey,
  INIT_LIST_NAMES,
  PICKER_COLORS,
  READONLY_LIST_NAMES,
} from "./constants";

export type RestrictedListName = (typeof READONLY_LIST_NAMES)[number];
export type InitalListName = (typeof INIT_LIST_NAMES)[number];

export type ListName = InitalListName | RestrictedListName | (string & {});

export type FormSubmitEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export type List = {
  name: ListName;
  color: string;
  icon: IconKey;
  createdAt: number;
  updatedAt: number;
};

export type Todo = {
  id: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  dependsOn?: Todo["id"];
  dependent?: Todo["id"];
  list: ListName;
};

export type TodoList = List & {
  todos: Todo[];
};

export type TodoLists = Record<ListName, TodoList>;

export type ListCount = {
  list: List;
  todoCount: number;
};

export type PickerColor = keyof typeof PICKER_COLORS;
