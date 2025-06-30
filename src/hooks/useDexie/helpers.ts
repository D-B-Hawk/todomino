import { db, getTodosWhereKey } from "../../db";
import { TodoKey, type ListName, type Todo } from "../../types";

export function getTodosByListName(listName: ListName) {
  if (listName === "completed") {
    return getTodosWhereKey(TodoKey.COMPLETED_AT).above(0);
  }
  if (listName === "todomino") {
    return getTodosWhereKey(TodoKey.DEPENDENT)
      .notEqual("")
      .or(TodoKey.DEPENDS_ON)
      .notEqual("");
  }
  return getTodosWhereKey(TodoKey.LIST)
    .equals(listName)
    .and((todo) => !todo.completedAt);
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
