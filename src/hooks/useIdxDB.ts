import { createSignal, type Accessor } from "solid-js";

export function useIdxDB<Item>(
  dbName: string,
): [
  Accessor<IDBDatabase | undefined>,
  Accessor<string | undefined>,
  { addItem: (item: Item) => void },
] {
  const [db, setDB] = createSignal<IDBDatabase>();
  const [dbError, setDBError] = createSignal<string>();

  const openDBRequest = window.indexedDB.open(dbName, 3);

  openDBRequest.onerror = () => {
    if (openDBRequest.error?.message) {
      setDBError(openDBRequest.error.message);
    }
  };

  openDBRequest.onupgradeneeded = () => {
    openDBRequest.result.createObjectStore(dbName, { autoIncrement: true });
  };

  openDBRequest.onsuccess = () => {
    setDB(openDBRequest.result);
  };

  const addItem = (item: Item) => {
    const currentDB = db();
    if (!currentDB) {
      setDBError("no db to speak of");
      return;
    }

    const addRequest = currentDB
      .transaction(dbName, "readwrite")
      .objectStore(dbName)
      .add(item);

    addRequest.onerror = () => {
      setDBError(addRequest.error?.message || "error adding item");
    };
  };

  return [db, dbError, { addItem }];
}
