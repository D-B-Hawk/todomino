import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { useObservable } from "@/hooks";
import {
  chosenListObservable,
  INIT_LIST_COMPLETE_INCOMPLETE,
  listsObservable,
  type ListCompleteIncompleteTodos,
  listCompleteIncompleteTodosObservable,
} from "./observables";
import { createList, type CreateListArgs, isConstantListName } from "@/helpers";
import { db, getTodosWhereKey } from "@/db";
import { type List, type ListName, type Todo } from "@/types";
import { INITIAL_LISTS_MAP } from "@/constants/lists";

type DexCtx = [
  {
    lists: Accessor<List[]>;
    listsCompleteIncompleteTodos: Accessor<ListCompleteIncompleteTodos>;
    chosenList: Accessor<List>;
  },
  {
    addTodo: (todo: Todo) => Promise<string>;
    deleteTodo: (todo: Todo) => Promise<void>;
    updateTodo: (todo: Todo) => Promise<number>;
    handleTodoCheck: (
      checked: boolean,
      todo: Todo,
    ) => Promise<number | undefined>;
    addList: (args: CreateListArgs) => Promise<void>;
    chooseList: (newList: List) => void;
    deleteList: (listName: ListName) => Promise<void>;
  },
];

export const DexieCtx = createContext<DexCtx>();

export function DexieProvider(props: ParentProps) {
  const lists = useObservable(listsObservable, []);

  const chosenList = useObservable(
    chosenListObservable,
    INITIAL_LISTS_MAP["reminders"],
  );

  const listsCompleteIncompleteTodos = useObservable(
    listCompleteIncompleteTodosObservable,
    {
      ...INIT_LIST_COMPLETE_INCOMPLETE,
    },
  );

  async function addList(args: CreateListArgs) {
    const currentList = chosenList();
    if (!currentList) {
      throw new Error("no current list");
    }

    const newList = createList(args);
    return db.transaction("rw", db.lists, db.chosenList, async () => {
      await db.lists.add(newList);
      await db.chosenList.update(currentList, newList);
    });
  }

  async function deleteList(listName: ListName) {
    if (isConstantListName(listName)) {
      throw new Error("unable to delete restricted list name");
    }

    return db.transaction("rw", db.lists, db.todos, (tx) => {
      tx.lists.delete(listName);
      getTodosWhereKey("list").equals(listName).delete();
    });
  }

  function chooseList(newList: List) {
    const currentList = chosenList();
    if (currentList) {
      db.chosenList.update(currentList, newList);
      return;
    }
    // if somehow the initial population did not take effect. add it here
    db.chosenList.add(newList);
  }

  async function addTodo(todo: Todo) {
    return db.todos.add(todo);
  }

  function deleteTodo(todo: Todo) {
    return db.todos.delete(todo.id);
  }

  function updateTodo(todo: Todo) {
    return db.todos.update(todo.id, todo);
  }

  async function handleTodoCheck(checked: boolean, todo: Todo) {
    // in the case of debouncing it is possible for nothing to change
    // for that situation return
    if (checked === !!todo.completedAt) {
      return;
    }
    const now = Date.now();
    const completedAt = checked ? now : undefined;

    return db.todos.update(todo, {
      updatedAt: now,
      completedAt,
    });
  }

  const dexieState = {
    lists,
    listsCompleteIncompleteTodos,
    chosenList,
  };

  const dexieMethods = {
    addTodo,
    deleteTodo,
    updateTodo,
    handleTodoCheck,
    addList,
    chooseList,
    deleteList,
  };

  return (
    <DexieCtx.Provider value={[dexieState, dexieMethods]}>
      {props.children}
    </DexieCtx.Provider>
  );
}

export function useDexieCtx() {
  const listCtx = useContext(DexieCtx);
  if (!listCtx) {
    throw new Error("useDexieCtx must be used within a DexieCtx.Provider");
  }
  return listCtx;
}
