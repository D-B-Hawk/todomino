import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { useObservable } from "@/hooks";
import {
  chosenListObservable,
  chosenListCompleteTodosObservable,
  chosenListIncompleteTodosObservable,
  listsObservable,
  listsIncompleteTodosCountObservable,
  type ListsIncompleteTodoMap,
} from "./observables";
import {
  createList,
  type CreateListArgs,
  hasTodominoIndex,
  isConstantListName,
} from "@/helpers";
import { db } from "@/db";
import { type List, type ListName, type Todo } from "@/types";
import {
  getTodosCollectionByListName,
  handleTodominoTodoIndexes,
} from "./helpers";

type DexCtx = [
  {
    lists: Accessor<List[]>;
    chosenList: Accessor<List | undefined>;
    listsIncompleteTodosCount: Accessor<ListsIncompleteTodoMap>;
    chosenListCompleteTodos: Accessor<Todo[]>;
    chosenListIncompleteTodos: Accessor<Todo[]>;
  },
  {
    addTodo: (todo: Todo) => Promise<string>;
    deleteTodo: (todo: Todo) => Promise<void>;
    updateTodo: (todo: Todo) => Promise<void>;
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

  const chosenList = useObservable(chosenListObservable, undefined);

  const chosenListCompleteTodos = useObservable(
    chosenListCompleteTodosObservable,
    [],
  );
  const chosenListIncompleteTodos = useObservable(
    chosenListIncompleteTodosObservable,
    [],
  );

  const listsIncompleteTodosCount = useObservable(
    listsIncompleteTodosCountObservable,
    {} as ListsIncompleteTodoMap,
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

    return db.transaction("rw", db.lists, db.todos, async (tx) => {
      tx.lists.delete(listName);

      const listOfTodos = tx.todos.where("list").equals(listName);

      const todominosInList =
        (await listOfTodos.and((todo) => hasTodominoIndex(todo)).count()) > 0;

      await listOfTodos.delete();

      if (todominosInList) {
        const todominoTodos =
          await getTodosCollectionByListName("todomino").toArray();

        todominoTodos.forEach(async (todo, idx) => {
          await tx.todos.update(todo, {
            dominoIndex: idx,
            updatedAt: Date.now(),
          });
        });
      }
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

  async function updateTodo(updatedTodo: Todo) {
    const currentTodo = await db.todos.get(updatedTodo.id);
    if (currentTodo) {
      // if the current todo had a todomino index and the updated one does not. shift all the
      // todos in the todomino list that have a higher index down one.

      return db.transaction("rw", db.todos, async (tx) => {
        if (
          hasTodominoIndex(currentTodo) &&
          updatedTodo.dominoIndex === undefined
        ) {
          await handleTodominoTodoIndexes(tx, currentTodo);
        }

        tx.todos.update(updatedTodo, {
          ...updatedTodo,
          updatedAt: Date.now(),
        });
      });
    }
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
      // if the todo is completed we can remove it from the todomino list
      if (completedAt && hasTodominoIndex(todo)) {
        await handleTodominoTodoIndexes(tx, todo);
      }

      return db.todos.update(todo, {
        updatedAt: now,
        completedAt,
        dominoIndex: undefined,
      });
    });
  }

  const dexieState = {
    lists,
    listsIncompleteTodosCount,
    chosenList,
    chosenListCompleteTodos,
    chosenListIncompleteTodos,
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
