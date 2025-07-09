import Dexie, { type EntityTable } from "dexie";
import type { List, Todo } from "@/types";
import { createList } from "@/helpers";
import { typedTable } from "./helpers";
import { INITIAL_LIST_NAMES, LIST_INFO_MAP } from "@/constants/lists";

export type TodosDBTable = {
  todos: EntityTable<Todo, "id">;
  lists: EntityTable<List, "name">;
  chosenList: EntityTable<List, "name">;
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

db.on("populate", function (transaction) {
  typedTable("lists", transaction)
    .bulkAdd(
      INITIAL_LIST_NAMES.map((list) => {
        const { color, icon } = LIST_INFO_MAP[list];
        return createList({ name: list, color, icon });
      }),
    )
    // eslint-disable-next-line no-console -- i want to know when this happens
    .then(() => console.log("initialized table with known lists"))
    .catch((error) =>
      console.error("failed to initiliaze db with known lists", error),
    );

  typedTable("chosenList", transaction).add(createList()); // will default to reminders
});
