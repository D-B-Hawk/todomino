import Dexie, { type EntityTable } from "dexie";
import type { List, Todo } from "./types";
import { INIT_LIST } from "./constants";

interface ListItem {
  name: List;
}

export const db = new Dexie("TodosDB") as Dexie & {
  todos: EntityTable<Todo, "id">;
  lists: EntityTable<ListItem, "name">;
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
});

db.on("populate", function (transaction) {
  transaction
    .table("lists")
    .bulkAdd([...INIT_LIST].map((list) => ({ name: list })))
    // eslint-disable-next-line no-console -- i want to know when this happens
    .then(() => console.log("initialized table with known lists"))
    .catch((error) =>
      console.error("failed to initiliaze db with known lists", error),
    );
});
