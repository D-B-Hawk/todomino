import { db } from "../db";
import { liveQuery } from "dexie";
import { useObservable } from "./useObservable";

export function useDexie() {
  const listsObservable = liveQuery(async () =>
    (await db.lists.toArray()).map((item) => item.name),
  );

  const todosObservable = liveQuery(() => db.todos.toArray());

  const lists = useObservable(listsObservable, []);
  const todos = useObservable(todosObservable, []);

  return [lists, todos] as const;
}
