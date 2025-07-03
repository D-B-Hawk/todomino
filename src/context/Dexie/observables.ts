import { liveQuery } from "dexie";
import { db, sortTodosByKey, type ChosenList } from "../../db";
import { getTodosByListName } from "../../context/Dexie/helpers";
import { TodoKey, type ListName } from "../../types";

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
    const { name: chosenListName }: ChosenList = (await db.chosenList
      .toCollection()
      .first()) || { name: "reminders" };

    const todosCollection = getTodosByListName(chosenListName);

    if (chosenListName === "completed") {
      return sortTodosByKey(TodoKey.COMPLETED_AT, todosCollection);
    }
    return sortTodosByKey(TodoKey.CREATED_AT, todosCollection);
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

export const chosenListNameObservable = liveQuery(async () => {
  const chosenList = await db.chosenList.toCollection().first();
  return chosenList?.name;
});
