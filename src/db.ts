import Dexie, { type EntityTable } from "dexie";
import type { List, ListName, Todo } from "./types";
import { INIT_LIST_NAMES } from "./constants";
import { createList } from "./helpers/createList";

export type ChosenList = {
  name: ListName;
};

export const db = new Dexie("TodosDB") as Dexie & {
  todos: EntityTable<Todo, "id">;
  lists: EntityTable<List, "name">;
  chosenList: EntityTable<ChosenList, "name">;
};

// Schema declaration:
db.version(1).stores({
  todos: `
    id, 
    description,
    createdAt, 
    updatedAt, 
    completedAt, 
    dependsOn, 
    dependent, 
    list`,
  lists: "name",
  chosenList: "name",
});

db.on("populate", function (transaction) {
  transaction
    .table("lists")
    .bulkAdd([...INIT_LIST_NAMES].map((list) => createList({ name: list })))
    // eslint-disable-next-line no-console -- i want to know when this happens
    .then(() => console.log("initialized table with known lists"))
    .catch((error) =>
      console.error("failed to initiliaze db with known lists", error),
    );
  transaction.table("chosenList").add({ name: "reminders" });
});
