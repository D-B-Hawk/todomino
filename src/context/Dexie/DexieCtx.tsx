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
import { db, type BulkTodoUpdate } from "@/db";
import { type List, type ListName, type Todo, type TodoUpdates } from "@/types";
import {
  getTodosCollectionByListName,
  reIndexTodominoIndexes,
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
    updateTodo: (todoID: Todo["id"], updates: TodoUpdates) => Promise<number>;
    bulkUpdateTodos: (
      updateInfo: BulkTodoUpdate[],
      todoWithDominoIndex?: boolean,
    ) => Promise<number>;
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

  async function updateTodo(todoID: Todo["id"], updates: TodoUpdates) {
    const currentTodo = await db.todos.get(todoID);
    if (currentTodo) {
      // if the current todo had a todomino index and the updated one does not. shift all the
      // todos in the todomino list that have a higher index down one.

      return db.transaction("rw", db.todos, async (tx) => {
        const update = await tx.todos.update(todoID, updates);

        if (
          hasTodominoIndex(currentTodo) &&
          updates.dominoIndex === undefined
        ) {
          await reIndexTodominoIndexes(tx);
        }

        return update;
      });
    }

    throw Error(`Todo with id: ${todoID} not found`);
  }

  async function bulkUpdateTodos(
    updateInfo: BulkTodoUpdate[],
    todoWithDominoIndex?: boolean,
  ) {
    return db.transaction("rw", db.todos, async (tx) => {
      const updateCount = await tx.todos.bulkUpdate(updateInfo);
      // if there was a todo with a dominoIndex we will re index that list
      if (todoWithDominoIndex) {
        await reIndexTodominoIndexes(tx);
      }
      return updateCount;
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
    bulkUpdateTodos,
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
