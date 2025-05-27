import { createSignal, type Accessor } from "solid-js";
import type { Todo } from "../types";

export function useIdxDB(): [
  Accessor<IDBDatabase | undefined>,
  Accessor<string | undefined>,
  { addTodo: (todo: Todo) => void },
] {
  const [db, setDB] = createSignal<IDBDatabase>();
  const [dbError, setDBError] = createSignal<string>();

  const openDBRequest = window.indexedDB.open("todos", 3);

  openDBRequest.onerror = () => {
    if (openDBRequest.error?.message) {
      setDBError(openDBRequest.error.message);
    }
  };

  openDBRequest.onupgradeneeded = () => {
    openDBRequest.result.createObjectStore("todos", { autoIncrement: true });
  };

  openDBRequest.onsuccess = () => {
    setDB(openDBRequest.result);
  };

  const addTodo = (todo: Todo) => {
    const currentDB = db();
    if (!currentDB) {
      setDBError("no db to speak of");
      return;
    }

    const addRequest = currentDB
      .transaction("todos", "readwrite")
      .objectStore("todos")
      .add(todo);

    addRequest.onerror = () => {
      setDBError(addRequest.error?.message || "error adding todo");
    };
  };

  return [db, dbError, { addTodo }];
}
