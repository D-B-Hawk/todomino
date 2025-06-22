import type { Collection, InsertType } from "dexie";
import type { Todo, TodoKey } from "../types";
import { db } from "./db";

export function getTodosWhereKey<K extends keyof Todo>(key: K) {
  return db.todos.where(key);
}

export function sortTodosByKey<K extends keyof Todo>(
  key: K,
  todos: Collection<Todo, string, InsertType<Todo, TodoKey.ID>>,
) {
  return todos.sortBy(key);
}
