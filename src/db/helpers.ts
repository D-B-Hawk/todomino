import type { Collection, InsertType, Table, Transaction } from "dexie";
import type { Todo } from "../types";
import { db, type TodosDBTable } from "./db";

export function getTodosWhereKey<K extends keyof Todo | Array<keyof Todo>>(
  key: K,
) {
  return db.todos.where(key);
}

export function orWhereIndexOrPrimary<K extends keyof Todo>(
  key: K,
  todos: Collection<Todo, string, InsertType<Todo, "id">>,
) {
  return todos.or(key);
}

export function sortTodosByKey<K extends keyof Todo>(
  key: K,
  todos: Collection<Todo, string, InsertType<Todo, "id">>,
) {
  return todos.sortBy(key);
}

export function typedTable<
  K extends keyof TodosDBTable,
  T = TodosDBTable[K] extends Table<infer Row> ? Row : never,
>(tableName: K, tx: Transaction): Table<T> {
  return tx.table(tableName) as Table<T>;
}
