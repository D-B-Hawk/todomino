import { createSignal, type Accessor } from "solid-js";

type UseIdxDBReturn<Item> = [
  Accessor<Item[]>,
  Accessor<string | undefined>,
  { addItem: (item: Item) => void },
];

export function useIdxDB<Item>(dbName: string): UseIdxDBReturn<Item> {
  const [db, setDB] = createSignal<IDBDatabase>();
  const [dbItems, setDBItems] = createSignal<Item[]>([]);
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
    getAllItems();
  };

  function createObjectStore() {
    return db()?.transaction(dbName, "readwrite").objectStore(dbName);
  }

  function getAllItems() {
    const objStore = createObjectStore();
    if (!objStore) {
      setDBError("no object store");
      return;
    }

    const request = objStore.getAll();

    request.onerror = () => {
      setDBError(request.error?.message || "error getting all items");
    };

    request.onsuccess = () => {
      setDBItems(request.result);
    };
  }

  const addItem = (item: Item) => {
    const objStore = createObjectStore();
    if (!objStore) {
      setDBError("no object store");
      return;
    }

    const addRequest = objStore.add(item);

    addRequest.onerror = () => {
      setDBError(addRequest.error?.message || "error adding item");
    };
  };

  return [dbItems, dbError, { addItem }];
}
