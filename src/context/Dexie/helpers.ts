import {
  getTodosWhereKey,
  sortTodosByKey,
  type TodosDBTransaction,
} from "@/db";
import { type ListName, type Todo } from "@/types";

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

  return getTodosWhereKey("list").equals(listName);
}

export async function handleTodominoTodoIndexes(
  tx: TodosDBTransaction,
  currentTodo: Todo,
) {
  // if the current todo had a todomino index and the updated one does not. shift all the
  // todos in the todomino that have a higher index down one.

  const currentTodominoTodos = getTodosCollectionByListName("todomino");

  const sortedTodos = (
    await sortTodosByKey("dominoIndex", currentTodominoTodos)
  ).filter((todo) => {
    if (
      todo.dominoIndex !== undefined &&
      currentTodo.dominoIndex !== undefined
    ) {
      return todo.dominoIndex > currentTodo.dominoIndex;
    }
  });

  sortedTodos.forEach(async (todo) => {
    let updatedIndex = todo.dominoIndex;
    if (updatedIndex !== undefined) {
      updatedIndex -= 1;
    }

    await tx.todos.update(todo, {
      ...todo,
      updatedAt: Date.now(),
      dominoIndex: updatedIndex,
    });
  });
}
