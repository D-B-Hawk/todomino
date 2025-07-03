import type { Collection, InsertType } from "dexie";
import type { Todo } from "../types";
import { db } from "./db";

export function getTodosWhereKey<K extends keyof Todo | Array<keyof Todo>>(
  key: K,
) {
  return db.todos.where(key);
}

export function sortTodosByKey<K extends keyof Todo>(
  key: K,
  todos: Collection<Todo, string, InsertType<Todo, "id">>,
) {
  return todos.sortBy(key);
}
