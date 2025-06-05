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
    let dependedOn: Todo | undefined;
    if (todo.dependsOn) {
      dependedOn = await db.todos.get(todo.dependsOn);
    }

    db.transaction("rw", db.todos, async () => {
      await db.todos.put(todo);
      if (dependedOn) {
        await db.todos.put({ ...dependedOn, dependent: todo.id });
      }
    }).catch((error) => {
      setError(getError(error, "error creating todo"));
    });
  }

  return [lists, todos, { error, addTodo }] as const;
}
