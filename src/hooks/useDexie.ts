import { liveQuery } from "dexie";
import { db } from "../db";
import { useObservable } from "./useObservable";
import type { ListName, Todo } from "../types";
import { createList } from "../helpers/createList";

export function useDexie() {
  const listsObservable = liveQuery(() => db.lists.toArray());

  const todosObservable = liveQuery(() => db.todos.toArray());

  const lists = useObservable(listsObservable, []);
  const todos = useObservable(todosObservable, []);

  function addList(listName: ListName) {
    const newList = createList({ name: listName });
    return db.lists.add(newList);
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
