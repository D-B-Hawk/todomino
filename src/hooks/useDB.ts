import { createSignal } from "solid-js";

export function useIdxDB() {
  const [db, setDB] = createSignal<IDBObjectStore>();
  const [dbError, setDBError] = createSignal<string>();

  const openDBRequest = window.indexedDB.open("todos", 3);

  openDBRequest.onerror = function () {
    if (this.error?.message) {
      setDBError(this.error.message);
    }
  };

  openDBRequest.onupgradeneeded = function () {
    const db = this.result;

    const todosDB = db.createObjectStore("todos", { autoIncrement: true });

    setDB(todosDB);
  };

  return [db, dbError];
}
