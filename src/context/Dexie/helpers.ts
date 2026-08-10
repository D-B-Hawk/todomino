import {
  getTodosWhereKey,
  sortTodosByKey,
  type BulkTodoUpdate,
  type TodosDBTransaction,
} from "@/db";
import { type ListName } from "@/types";
import dayjs from "dayjs";

// use this for the todo list hydration in dexie
export function getTodosCollectionByListName(listName: ListName) {
  if (listName === "completed") {
    return getTodosWhereKey("completedAt").above(0);
  }
  if (listName === "todomino") {
    return getTodosWhereKey("dominoIndex").notEqual("");
  }
  if (listName === "today") {
    return getTodosWhereKey("dueDate").belowOrEqual(Date.now());
  }
  if (listName === "tomorrow") {
    return getTodosWhereKey("dueDate")
      .notEqual("")
      .filter((todo) => dayjs(todo.dueDate).isTomorrow());
  }

  return getTodosWhereKey("list").equals(listName);
}

export async function reIndexTodominoIndexes(tx: TodosDBTransaction) {
  // if the current todo had a todomino index and the updated one does not. shift all the
  // todos in the todomino that have a higher index down one.

  const currentTodominoTodos = getTodosCollectionByListName("todomino");

  const sortedTodos = await sortTodosByKey("dominoIndex", currentTodominoTodos);

  // will just use the index from map to re index the todomino list
  const transformedForBulkUpdatesTodos = sortedTodos.map<BulkTodoUpdate>(
    (todo, curIndex) => ({
      key: todo.id,
      changes: {
        dominoIndex: curIndex,
      },
    }),
  );

  return tx.todos.bulkUpdate(transformedForBulkUpdatesTodos);
}
