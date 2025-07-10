import {
  db,
  getTodosWhereKey,
  orWhereIndexOrPrimary,
  sortTodosByKey,
} from "@/db";
import { type ListName, type Todo } from "@/types";
import type { Collection, InsertType } from "dexie";

export function getTodosCollectionByListName(listName: ListName) {
  if (listName === "completed") {
    return getTodosWhereKey("completedAt").above(0);
  }
  if (listName === "todomino") {
    const todos = getTodosWhereKey("dependent").notEqual("");
    return orWhereIndexOrPrimary("dependsOn", todos).notEqual("");
  }

  return getTodosWhereKey("list").equals(listName);
}

export async function getCompleteIncompleteTodos(
  todos: Collection<Todo, string, InsertType<Todo, "id">>,
) {
  const complete: Todo[] = [];
  const incomplete: Todo[] = [];

  const todoArray = await sortTodosByKey("createdAt", todos);

  todoArray.forEach((todo) => {
    if (todo.completedAt) {
      complete.push(todo);
      return;
    }
    incomplete.push(todo);
  });

  return { complete, incomplete };
}

export async function getDependents(todo: Todo) {
  // defaulting dependent and depends on to a string as bulkGet is looking for a string
  const { dependent = "", dependsOn = "" } = todo;
  const [dependentTodo, dependsOnTodo] = await db.todos.bulkGet([
    dependent,
    dependsOn,
  ]);

  return {
    dependentTodo,
    dependsOnTodo,
  };
}
