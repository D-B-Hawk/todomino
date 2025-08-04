import Dexie, { type EntityTable } from "dexie";
import type { List, Todo } from "@/types";
import { createList } from "@/helpers";
import { typedTable } from "./helpers";
import { INITIAL_LISTS } from "@/constants/lists";

export type TodosDBTable = {
  todos: EntityTable<Todo, "id">;
  lists: EntityTable<List, "name">;
  chosenList: EntityTable<List, "name">;
};

export const db = new Dexie("TodosDB") as Dexie & TodosDBTable;

const TODO_KEY_MAP: Record<keyof Todo, keyof Todo> = {
  id: "id",
  list: "list",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  dueDate: "dueDate",
  completedAt: "completedAt",
  dependent: "dependent",
  dependsOn: "dependsOn",
};

const TODO_KEYS = Object.values(TODO_KEY_MAP);

const dbSchema: Record<keyof TodosDBTable, string> = {
  todos: `${TODO_KEYS.join(", ")}`,
  lists: "name",
  chosenList: "name",
};

// Schema declaration:
db.version(1).stores(dbSchema);

db.on("populate", function (transaction) {
  typedTable("lists", transaction)
    .bulkAdd(INITIAL_LISTS)
    // eslint-disable-next-line no-console -- i want to know when this happens
    .then(() => console.log("initialized table with known lists"))
    .catch((error) =>
      console.error("failed to initiliaze db with known lists", error),
    );

  typedTable("chosenList", transaction).add(createList()); // will default to reminders
});
