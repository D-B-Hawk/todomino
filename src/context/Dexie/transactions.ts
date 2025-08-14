import type { Transaction } from "dexie";
import type { TodosDBTable } from "@/db/db";
import type { Todo } from "@/types";

export async function updateTodoDependents(
  tx: Transaction & TodosDBTable,
  todo: Todo,
  ignoringWithinList: "ignoreWithinList" | "global" = "global",
) {
  const { dependentTodo, dependsOnTodo } = todo;
  const now = Date.now();

  function meetsCondition(otherTodo: Todo) {
    if (ignoringWithinList === "ignoreWithinList") {
      return otherTodo.list !== todo.list;
    }
    return !!otherTodo;
  }

  if (dependsOnTodo && meetsCondition(dependsOnTodo)) {
    await tx.todos.update(dependsOnTodo, {
      updatedAt: now,
      dependentTodo,
    });
  }
  if (dependentTodo && meetsCondition(dependentTodo)) {
    await tx.todos.update(dependentTodo, {
      updatedAt: now,
      dependsOnTodo,
    });
  }
}
