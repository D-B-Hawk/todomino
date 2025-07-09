import { liveQuery } from "dexie";
import { db, sortTodosByKey } from "@/db";
import { getTodosByListName } from "./helpers";
import type { ListName } from "@/types";
import { createList } from "@/helpers";

export type ListTodoCount = Record<ListName, number>;

export const INIT_LIST_TODO_COUNT: ListTodoCount = {
  completed: 0,
  reminders: 0,
  today: 0,
  todomino: 0,
};

export const listsObservable = liveQuery(() =>
  db.transaction("r", db.lists, () => db.lists.toArray()),
);

export const chosenListTodosObservable = liveQuery(() =>
  db.transaction("r", db.chosenList, db.todos, async () => {
    // defaulting the chosen list to reminders
    const { name: chosenListName } =
      (await db.chosenList.toCollection().first()) || createList(); // this will default to reminders

    const todosCollection = getTodosByListName(chosenListName);

    if (chosenListName === "completed") {
      return sortTodosByKey("completedAt", todosCollection);
    }
    return sortTodosByKey("createdAt", todosCollection);
  }),
);

export const listTodoCountObservable = liveQuery(() =>
  db.transaction("r", db.lists, db.todos, async () => {
    const listsTodoCount = { ...INIT_LIST_TODO_COUNT };
    const lists = await db.lists.toArray();
    lists.forEach(async (list) => {
      listsTodoCount[list.name] = await getTodosByListName(list.name).count();
    });
    return listsTodoCount;
  }),
);

export const chosenListObservable = liveQuery(async () => {
  return db.chosenList.toCollection().first();
});
