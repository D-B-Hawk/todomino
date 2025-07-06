import { db, getTodosWhereKey, orWhereIndexOrPrimary } from "@/db";
import { type ListName, type Todo } from "@/types";

export function getTodosByListName(
  listName: ListName,
  completionType: "removeCompleted" | "keepCompleted" = "removeCompleted",
) {
  if (listName === "completed") {
    return getTodosWhereKey("completedAt").above(0);
  }
  if (listName === "todomino") {
    const withDependent = getTodosWhereKey("dependent").notEqual("");

    return orWhereIndexOrPrimary("dependsOn", withDependent).notEqual("");
  }

  let todos = getTodosWhereKey("list").equals(listName);
  if (completionType === "removeCompleted") {
    todos = todos.and((todo) => !todo.completedAt);
  }
  return todos;
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
