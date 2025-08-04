import type { DOMElement } from "solid-js/jsx-runtime";
import type { IconKey } from "@/constants/icons";
import type {
  ListName,
  ReadOnlyListName,
  MainListName,
  ListAction,
  List,
} from "@/constants/lists";
import type { PickerColor } from "@/constants/colors";
export type {
  IconKey,
  ListName,
  ReadOnlyListName,
  MainListName,
  PickerColor,
  ListAction,
  List,
};

export type FormSubmitEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export type Todo = {
  id: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
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
