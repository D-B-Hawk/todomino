import Dexie, { type EntityTable } from "dexie";
import { TodoKey, type List, type ListName, type Todo } from "./types";
import { INIT_LIST_NAMES } from "./constants";
import { createList } from "./helpers/createList";

export type ChosenList = {
  name: ListName;
};

export const db = new Dexie("TodosDB") as Dexie & {
  todos: EntityTable<Todo, TodoKey.ID>;
  lists: EntityTable<List, "name">;
  chosenList: EntityTable<ChosenList, "name">;
};

// Schema declaration:
db.version(1).stores({
  todos: `
    ${TodoKey.ID}, 
    ${TodoKey.DESCRIPTION},
    ${TodoKey.CREATED_AT},
    ${TodoKey.UPDATED_AT},
    ${TodoKey.COMPLETED_AT},
    ${TodoKey.DEPENDS_ON}, 
    ${TodoKey.DEPENDENT},
    ${TodoKey.LIST} 
    `,
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
