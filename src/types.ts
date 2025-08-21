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
  list: ListName;
  dueDate?: number;
  completedAt?: number;
  dominoIndex?: number;
};

export type TodoList = List & {
  todos: Todo[];
};

export type TodoLists = Record<ListName, TodoList>;

export type ListCount = {
  list: List;
  todoCount: number;
};
