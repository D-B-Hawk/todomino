import { liveQuery } from "dexie";
import { db } from "@/db";
import {
  getCompleteIncompleteTodos,
  getTodosCollectionByListName,
} from "./helpers";
import type { ListName, Todo } from "@/types";
import { createList } from "@/helpers";
import { INITIAL_LISTS_MAP } from "@/constants/lists";

export type ListCompleteIncompleteTodos = Record<
  ListName,
  { complete: Todo[]; incomplete: Todo[] }
>;

export const INIT_LIST_COMPLETE_INCOMPLETE: ListCompleteIncompleteTodos = {
  completed: { complete: [], incomplete: [] },
  reminders: { complete: [], incomplete: [] },
  today: { complete: [], incomplete: [] },
  todomino: { complete: [], incomplete: [] },
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

export const listCompleteIncompleteTodosObservable = liveQuery(() =>
  db.transaction("r", db.lists, db.todos, async () => {
    const listsTodoCount = { ...INIT_LIST_COMPLETE_INCOMPLETE };

    const lists = await db.lists.toArray();

    lists.forEach(async (list) => {
      listsTodoCount[list.name] = {
        complete: await getTodosCollectionByListName(list.name)
          .and((todo) => !!todo.completedAt)
          .toArray(),
        incomplete: await getTodosCollectionByListName(list.name)
          .and((todo) => !todo.completedAt)
          .toArray(),
      };
    });

    return listsTodoCount;
  }),
);

export const chosenListObservable = liveQuery(async () => {
  const chosenList = await db.chosenList.toCollection().first();
  const defaultList = INITIAL_LISTS_MAP["reminders"];
  return chosenList ?? defaultList;
});
