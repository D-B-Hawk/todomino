import { createSignal, type Accessor } from "solid-js";

type UseIdxDBReturn<Item> = [
  Accessor<Item[]>,
  {
    addItem: (item: Item) => void;
    updateItem: (item: Item) => void;
    reqError: Accessor<string | undefined>;
    dbError: Accessor<string | undefined>;
  },
];

export function useIdxDB<Item>(dbName: string): UseIdxDBReturn<Item> {
  const [db, setDB] = createSignal<IDBDatabase>();
  const [dbItems, setDBItems] = createSignal<Item[]>([]);
  const [dbError, setDBError] = createSignal<string>();
  const [reqError, setReqError] = createSignal<string>();

  const openDBRequest = window.indexedDB.open(dbName, 3);

  openDBRequest.onerror = () => {
    setDBError(openDBRequest.error?.message);
  };

  openDBRequest.onupgradeneeded = () => {
    openDBRequest.result.createObjectStore(dbName, { keyPath: "id" });
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
      setReqError(request.error?.message);
    };

    request.onsuccess = () => {
      setDBItems(request.result);
    };
  }

  function handleReqError(this: IDBRequest<IDBValidKey>) {
    setReqError(this.error?.message);
  }

  function updateItem(item: Item) {
    const objStore = createObjectStore();
    if (!objStore) {
      setDBError("no object store");
      return;
    }

    const request = objStore.put(item);
    request.onerror = handleReqError;

    request.onsuccess = () => {
      getAllItems();
    };
  }

  const addItem = (item: Item) => {
    const objStore = createObjectStore();
    if (!objStore) {
      setDBError("no object store");
      return;
    }

    const addRequest = objStore.add(item);

    addRequest.onerror = handleReqError;

    addRequest.onsuccess = () => {
      getAllItems();
    };
  };

  return [dbItems, { addItem, updateItem, reqError, dbError }];
}
