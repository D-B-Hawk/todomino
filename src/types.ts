import type { DOMElement } from "solid-js/jsx-runtime";
import { IconKey, INIT_LIST_NAMES } from "./constants";

export type ListName = (typeof INIT_LIST_NAMES)[number] | (string & {});

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

export enum TodoKey {
  ID = "id",
  DESCRIPTION = "description",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  COMPLETED_AT = "completedAt",
  DEPENDS_ON = "dependsOn",
  DEPENDENT = "dependent",
  LIST = "list",
}

export type Todo = {
  [TodoKey.ID]: string;
  [TodoKey.DESCRIPTION]: string;
  [TodoKey.CREATED_AT]: number;
  [TodoKey.UPDATED_AT]: number;
  [TodoKey.COMPLETED_AT]?: number;
  [TodoKey.DEPENDS_ON]?: Todo["id"];
  [TodoKey.DEPENDENT]?: Todo["id"];
  [TodoKey.LIST]: ListName;
};

export type TodoList = List & {
  todos: Todo[];
};

export type TodoLists = Record<ListName, TodoList>;

export type ListCount = {
  list: List;
  todoCount: number;
};
