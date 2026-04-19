import { liveQuery } from "dexie";
import { db } from "@/db";
import { type ListName } from "@/constants/lists";
import { getTodosCollectionByListName } from "./helpers";

export type ListsIncompleteTodoMap = Record<ListName, number>;

export const listsObservable = liveQuery(() => db.lists.toArray());

export const chosenListObservable = liveQuery(() =>
  db.chosenList.toCollection().first(),
);

export const chosenListIncompleteTodosObservable = liveQuery(async () => {
  const chosenList = await db.chosenList.toCollection().first();
  if (!chosenList) {
    return [];
  }
  return getTodosCollectionByListName(chosenList.name)
    .and((todo) => todo.completedAt === undefined)
    .toArray();
});

export const chosenListCompleteTodosObservable = liveQuery(async () => {
  const chosenList = await db.chosenList.toCollection().first();
  if (!chosenList) {
    return [];
  }
  return getTodosCollectionByListName(chosenList.name)
    .and((todo) => todo.completedAt !== undefined)
    .toArray();
});

export const listsIncompleteTodosCountObservable = liveQuery(async () => {
  const lists = await db.lists.toArray();
  const listsIncompleteTodoMap = {} as ListsIncompleteTodoMap;

  for (const list of lists) {
    listsIncompleteTodoMap[list.name] = await getTodosCollectionByListName(
      list.name,
    )
      .and((todo) => todo.completedAt === undefined)
      .count();
  }

  return listsIncompleteTodoMap;
});
