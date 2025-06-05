import { db } from "../db";
import { liveQuery } from "dexie";
import { useObservable } from "./useObservable";
import type { Todo } from "../types";
import { createSignal } from "solid-js";
import { getError } from "../helpers/getError";

export function useDexie() {
  const [error, setError] = createSignal<Error>();

  const listsObservable = liveQuery(async () =>
    (await db.lists.toArray()).map((item) => item.name),
  );

  const todosObservable = liveQuery(() => db.todos.toArray());

  const lists = useObservable(listsObservable, []);
  const todos = useObservable(todosObservable, []);

  async function addTodo(todo: Todo) {
    const { dependsOnTodo } = await getDependents(todo);

    db.transaction("rw", db.todos, async () => {
      await db.todos.put(todo);
      if (dependsOnTodo) {
        await db.todos.put({
          ...dependsOnTodo,
          dependent: todo.id,
          updatedAt: Date.now(),
        });
      }
    }).catch((error) => {
      setError(getError(error, "error creating todo"));
    });
  }

  async function getDependents(todo: Todo) {
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

  return [lists, todos, { error, addTodo }] as const;
}
