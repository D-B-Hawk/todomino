import { liveQuery } from "dexie";
import { db } from "@/db";
import {
  getCompleteIncompleteTodos,
  getTodosCollectionByListName,
} from "./helpers";
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

    const todosCollection = getTodosCollectionByListName(chosenListName);
    return getCompleteIncompleteTodos(todosCollection);
  }),
);

export const listTodoCountObservable = liveQuery(() =>
  db.transaction("r", db.lists, db.todos, async () => {
    const listsTodoCount = { ...INIT_LIST_TODO_COUNT };
    const lists = await db.lists.toArray();
    lists.forEach(async (list) => {
      let todosCollection = getTodosCollectionByListName(list.name);
      if (list.name !== "completed") {
        todosCollection = todosCollection.and((todo) => !todo.completedAt);
      }
      listsTodoCount[list.name] = await todosCollection.count();
    });
    return listsTodoCount;
  }),
);

export const chosenListObservable = liveQuery(async () => {
  return db.chosenList.toCollection().first();
});
