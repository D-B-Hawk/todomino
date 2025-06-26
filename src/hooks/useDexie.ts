import { liveQuery } from "dexie";
import { type ListName, type Todo, type ListCount, TodoKey } from "../types";
import { db, type ChosenList, getTodosWhereKey, sortTodosByKey } from "../db";
import { useObservable } from "./useObservable";
import { createList, type CreateListArgs } from "../helpers/createList";

function getTodosByList(listName: ListName) {
  if (listName === "completed") {
    return getTodosWhereKey(TodoKey.COMPLETED_AT).above(0);
  }
  return getTodosWhereKey(TodoKey.LIST)
    .equals(listName)
    .and((todo) => !todo.completedAt);
}

export function useDexie() {
  const listsObservable = liveQuery(() =>
    db.transaction("r", db.lists, db.todos, async () => {
      const listsCount: ListCount[] = [];
      const lists = await db.lists.toArray();
      lists.forEach(async (list) => {
        listsCount.push({
          list,
          todoCount: await getTodosByList(list.name).count(),
        });
      });
      return listsCount;
    }),
  );

  const todosObservable = liveQuery(() =>
    db.transaction("r", db.chosenList, db.todos, async () => {
      // defaulting the chosen list to reminders
      const chosenList: ChosenList = (await db.chosenList
        .toCollection()
        .first()) || { name: "reminders" };

      const todosCollection = getTodosByList(chosenList.name);

      if (chosenList.name === "completed") {
        return sortTodosByKey(TodoKey.COMPLETED_AT, todosCollection);
      }
      return sortTodosByKey(TodoKey.CREATED_AT, todosCollection);
    }),
  );

  const chosenListObservable = liveQuery(async () => {
    const chosenList = await db.chosenList.toCollection().first();
    return chosenList?.name;
  });

  const lists = useObservable(listsObservable, []);
  const todos = useObservable(todosObservable, []);
  const chosenList = useObservable(chosenListObservable, "reminders");

  async function addList(args: CreateListArgs) {
    const currentList = chosenList();
    if (!currentList) {
      throw new Error("no current list");
    }

    const newList = createList(args);
    return db.transaction("rw", db.lists, db.chosenList, async () => {
      await db.lists.add(newList);
      await db.chosenList.update(currentList, { name: newList.name });
    });
  }

  function chooseList(listName: ListName) {
    const currentList = chosenList();
    if (currentList) {
      db.chosenList.update(currentList, { name: listName });
      return;
    }
    // if somehow the initial population did not take effect. add it here
    db.chosenList.add({ name: listName });
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
    // in the case of debouncing it is possible for nothing to change
    // for that situation return
    if (checked === !!todo[TodoKey.COMPLETED_AT]) {
      return;
    }
    const { dependentTodo, dependsOnTodo } = await getDependents(todo);
    const now = Date.now();
    const completedAt = checked ? now : undefined;

    return db.transaction("rw", db.todos, async () => {
      db.todos.update(todo, {
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

  return [
    lists,
    todos,
    chosenList,
    { addTodo, handleTodoCheck, addList, chooseList },
  ] as const;
}
