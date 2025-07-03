import Dexie, { type EntityTable } from "dexie";
import { type List, type ListName, type Todo } from "../types";
import { INIT_LIST_NAMES, READONLY_LIST_NAMES } from "../constants";
import { createList } from "../helpers/createList";

export type ChosenList = {
  name: ListName;
};

type TodosDBTable = {
  todos: EntityTable<Todo, "id">;
  lists: EntityTable<List, "name">;
  chosenList: EntityTable<ChosenList, "name">;
};

export const db = new Dexie("TodosDB") as Dexie & TodosDBTable;

const TODO_KEYS = new Set<Readonly<keyof Todo>>([
  "id",
  "list",
  "description",
  "createdAt",
  "updatedAt",
  "completedAt",
  "dependent",
  "dependsOn",
]);

const dbSchema: Record<keyof TodosDBTable, string> = {
  todos: `${Array.from(TODO_KEYS).join(", ")}`,
  lists: "name",
  chosenList: "name",
};

// Schema declaration:
db.version(1).stores(dbSchema);

// TOD0: Enforce using only known tablenames on transactions.
db.on("populate", function (transaction) {
  transaction
    .table("lists") // I no likey this
    .bulkAdd(
      [...INIT_LIST_NAMES, ...READONLY_LIST_NAMES].map((list) =>
        createList({ name: list }),
      ),
    )
    // eslint-disable-next-line no-console -- i want to know when this happens
    .then(() => console.log("initialized table with known lists"))
    .catch((error) =>
      console.error("failed to initiliaze db with known lists", error),
    );
  // or this
  transaction.table("chosenList").add({ name: "reminders" });
});
