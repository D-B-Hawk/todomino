import type { Transaction } from "dexie";
import type { TodosDBTable } from "@/db/db";
import type { Todo } from "@/types";
import { getDependents } from "./helpers";

export async function updateTodoDependents(
  tx: Transaction & TodosDBTable,
  todo: Todo,
  ignoringWithinList: "ignoreWithinList" | "global" = "global",
) {
  const { dependentTodo, dependsOnTodo } = await getDependents(todo);
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
      dependent: dependentTodo?.id,
    });
  }
  if (dependentTodo && meetsCondition(dependentTodo)) {
    await tx.todos.update(dependentTodo, {
      updatedAt: now,
      dependsOn: dependsOnTodo?.id,
    });
  }
}
