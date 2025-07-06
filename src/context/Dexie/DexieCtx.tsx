import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { useObservable } from "@/hooks";
import {
  chosenListNameObservable,
  chosenListTodosObservable,
  INIT_LIST_TODO_COUNT,
  listsObservable,
  listTodoCountObservable,
  type ListTodoCount,
} from "./observables";
import {
  createList,
  type CreateListArgs,
  isRestrictedListName,
} from "@/helpers";
import { db } from "@/db";
import { type List, type ListName, type Todo } from "@/types";
import { getDependents, getTodosByListName } from "./helpers";

type DexieState = [
  {
    lists: Accessor<List[]>;
    listsTodoCount: Accessor<ListTodoCount>;
    chosenListTodos: Accessor<Todo[]>;
    chosenListName: Accessor<ListName | undefined>;
  },
  {
    addTodo: (todo: Todo) => Promise<void>;
    handleTodoCheck: (checked: boolean, todo: Todo) => Promise<void>;
    addList: (args: CreateListArgs) => Promise<void>;
    chooseList: (listName: ListName) => void;
    deleteList: (listName: ListName) => Promise<void[]>;
  },
];

export const DexieCtx = createContext<DexieState>();

export function DexieProvider(props: ParentProps) {
  const lists = useObservable(listsObservable, []);
  const chosenListTodos = useObservable(chosenListTodosObservable, []);
  const chosenListName = useObservable(chosenListNameObservable, "reminders");
  const listsTodoCount = useObservable(listTodoCountObservable, {
    ...INIT_LIST_TODO_COUNT,
  });

  async function addList(args: CreateListArgs) {
    const currentList = chosenListName();
    if (!currentList) {
      throw new Error("no current list");
    }

    const newList = createList(args);
    return db.transaction("rw", db.lists, db.chosenList, async () => {
      await db.lists.add(newList);
      await db.chosenList.update(currentList, { name: newList.name });
    });
  }

  async function deleteList(listName: ListName) {
    if (isRestrictedListName(listName)) {
      throw new Error("unable to delete restricted list name");
    }

    const listTodos = await getTodosByListName(
      listName,
      "keepCompleted",
    ).toArray();

    return db.transaction("rw", db.lists, db.todos, () => {
      // delete the list
      db.lists.delete(listName);

      // delete all the todos within that list, update todos that are either dependent
      // or depended on if they are not within that list
      const updatedTodosTransactions = listTodos.map(async (todo) => {
        const { dependentTodo, dependsOnTodo } = await getDependents(todo);
        const now = Date.now();

        db.todos.delete(todo.id);
        if (dependsOnTodo && dependsOnTodo.list !== todo.list) {
          await db.todos.update(dependsOnTodo, {
            updatedAt: now,
            dependent: undefined,
          });
        }
        if (dependentTodo && dependentTodo.list !== todo.list) {
          await db.todos.update(dependentTodo, {
            updatedAt: now,
            dependsOn: undefined,
          });
        }
      });

      return Promise.all(updatedTodosTransactions);
    });
  }

  function chooseList(listName: ListName) {
    const currentList = chosenListName();
    if (currentList) {
      db.chosenList.update(currentList, { name: listName });
      return;
    }
    // if somehow the initial population did not take effect. add it here
    db.chosenList.add({ name: listName });
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

  async function handleTodoCheck(checked: boolean, todo: Todo) {
    // in the case of debouncing it is possible for nothing to change
    // for that situation return
    if (checked === !!todo.completedAt) {
      return;
    }
    const { dependentTodo, dependsOnTodo } = await getDependents(todo);
    const now = Date.now();
    const completedAt = checked ? now : undefined;

    return db.transaction("rw", db.todos, async () => {
      db.todos.update(todo, {
        updatedAt: now,
        dependent: undefined,
        dependsOn: undefined,
        completedAt,
      });
      if (dependsOnTodo && dependentTodo?.id) {
        await db.todos.update(dependsOnTodo, {
          updatedAt: now,
          dependent: dependentTodo.id, // if the todo also had a dependent. transfer that dependent to its dependsOn
        });
      }
      if (dependentTodo && dependsOnTodo) {
        await db.todos.update(dependentTodo, {
          updatedAt: now,
          dependsOn: dependsOnTodo.id, // transfer the dependsOn todo to the child if present
        });
      }
    });
  }

  const dexieState = {
    lists,
    listsTodoCount,
    chosenListTodos,
    chosenListName,
  };

  const dexieMethods = {
    addTodo,
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
