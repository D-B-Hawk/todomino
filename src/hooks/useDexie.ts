import { liveQuery } from "dexie";
import { db } from "../db";
import { useObservable } from "./useObservable";
import type { List, Todo } from "../types";

export function useDexie() {
  const listsObservable = liveQuery(async () =>
    (await db.lists.toArray()).map((item) => item.name),
  );

  const todosObservable = liveQuery(() => db.todos.toArray());

  const lists = useObservable(listsObservable, []);
  const todos = useObservable(todosObservable, []);

  function addList(list: List) {
    return db.lists.add({ name: list });
  }

  async function addTodo(todo: Todo) {
    const { dependsOnTodo } = await getDependents(todo);

    return db.transaction("rw", db.todos, async () => {
      await db.todos.put(todo);
      if (dependsOnTodo) {
        await db.todos.put({
          ...dependsOnTodo,
          dependent: todo.id,
          updatedAt: Date.now(),
        });
      }
    });
  }

  async function handleTodoCheck(checked: boolean, todo: Todo) {
    const { dependentTodo, dependsOnTodo } = await getDependents(todo);
    const now = Date.now();
    const completedAt = checked ? now : undefined;

    return db.transaction("rw", db.todos, async () => {
      db.todos.update(todo.id, {
        updatedAt: now,
        dependent: undefined,
        dependsOn: undefined,
        completedAt,
      });
      if (dependsOnTodo) {
        await db.todos.update(dependsOnTodo, {
          updatedAt: now,
          dependent: undefined,
        });
      }
      if (dependentTodo) {
        await db.todos.update(dependentTodo, {
          updatedAt: now,
          dependsOn: undefined,
        });
      }
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

  return [lists, todos, { addTodo, handleTodoCheck, addList }] as const;
}
