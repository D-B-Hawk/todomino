import type { DOMElement } from "solid-js/jsx-runtime";
import type { IconKey } from "@/constants/icons";
import type {
  ListName,
  ReadOnlyListName,
  MainListName,
} from "@/constants/lists";
import type { PickerColor } from "@types";
export type { PickerColor } from "./constants/colors";
export type { IconKey, ListName, ReadOnlyListName, MainListName };

export type FormSubmitEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export type List = {
  name: ListName;
  color: PickerColor;
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
