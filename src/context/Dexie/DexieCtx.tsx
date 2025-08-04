import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { useObservable } from "@/hooks";
import {
  chosenListObservable,
  chosenListTodosObservable,
  INIT_LIST_TODO_COUNT,
  listsObservable,
  type ListTodoCount,
  listTodoCountObservable,
} from "./observables";
import { createList, type CreateListArgs, isConstantListName } from "@/helpers";
import { db } from "@/db";
import { type List, type ListName, type Todo } from "@/types";
import { getDependents, getTodosCollectionByListName } from "./helpers";
import { updateTodoDependents } from "./transactions";
import { INITIAL_LISTS_MAP } from "@/constants/lists";

type DexCtx = [
  {
    lists: Accessor<List[]>;
    listsTodoCount: Accessor<ListTodoCount>;
    chosenListTodos: Accessor<{ complete: Todo[]; incomplete: Todo[] }>;
    chosenList: Accessor<List | undefined>;
  },
  {
    addTodo: (todo: Todo) => Promise<void>;
    deleteTodo: (todo: Todo) => Promise<void>;
    updateTodo: (todo: Todo) => Promise<number>;
    handleTodoCheck: (checked: boolean, todo: Todo) => Promise<void>;
    addList: (args: CreateListArgs) => Promise<void>;
    chooseList: (newList: List) => void;
    deleteList: (listName: ListName) => Promise<void[]>;
  },
];

export const DexieCtx = createContext<DexCtx>();

export function DexieProvider(props: ParentProps) {
  const lists = useObservable(listsObservable, []);
  const chosenListTodos = useObservable(chosenListTodosObservable, {
    complete: [],
    incomplete: [],
  });
  const chosenList = useObservable(
    chosenListObservable,
    INITIAL_LISTS_MAP["reminders"],
  );
  const listsTodoCount = useObservable(listTodoCountObservable, {
    ...INIT_LIST_TODO_COUNT,
  });

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

    const todos = await getTodosCollectionByListName(listName).toArray();

    return db.transaction("rw", db.lists, db.todos, (tx) => {
      // delete the list
      tx.lists.delete(listName);

      // delete all the todos within that list, update todos that are either dependent
      // or depended on if they are not within that list
      const updatedTodosTransactions = todos.map(async (todo) => {
        db.todos.delete(todo.id);
        updateTodoDependents(tx, todo, "ignoreWithinList");
      });

      return Promise.all(updatedTodosTransactions);
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
    const { dependsOnTodo } = await getDependents(todo);

    return db.transaction("rw", db.todos, async () => {
      await db.todos.put(todo);
      if (dependsOnTodo) {
        await db.todos.put({
          ...dependsOnTodo,
          dependent: todo.id,
          updatedAt: Date.now(),
        });
      }
    });
  }

  function deleteTodo(todo: Todo) {
    return db.transaction("rw", db.todos, (tx) => {
      tx.todos.delete(todo.id);
      updateTodoDependents(tx, todo);
    });
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

    return db.transaction("rw", db.todos, async (tx) => {
      tx.todos.update(todo, {
        updatedAt: now,
        dependent: undefined,
        dependsOn: undefined,
        completedAt,
      });
      updateTodoDependents(tx, todo);
    });
  }

  const dexieState = {
    lists,
    listsTodoCount,
    chosenListTodos,
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
