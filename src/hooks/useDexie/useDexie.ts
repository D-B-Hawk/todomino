import { type ListName, type Todo, TodoKey } from "../../types";
import { db } from "../../db";
import { useObservable } from "../useObservable";
import { createList, type CreateListArgs } from "../../helpers/createList";
import {
  chosenListNameObservable,
  chosenListTodosObservable,
  INIT_LIST_TODO_COUNT,
  listsObservable,
  listTodoCountObservable,
} from "./observables";
import { getDependents } from "./helpers";

export function useDexie() {
  const lists = useObservable(listsObservable, []);
  const chosenListTodos = useObservable(chosenListTodosObservable, []);
  const listsTodoCount = useObservable(listTodoCountObservable, {
    ...INIT_LIST_TODO_COUNT,
  });
  const chosenListName = useObservable(chosenListNameObservable, "reminders");

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
    if (checked === !!todo[TodoKey.COMPLETED_AT]) {
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
      if (dependsOnTodo) {
        await db.todos.update(dependsOnTodo, {
          updatedAt: now,
          dependent: dependentTodo?.[TodoKey.ID], // if the todo also had a dependent. transfer that dependent to its dependsOn
        });
      }
      if (dependentTodo) {
        await db.todos.update(dependentTodo, {
          updatedAt: now,
          dependsOn: dependsOnTodo?.[TodoKey.ID], // transfer the dependsOn todo to the child if present
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
  };

  return [dexieState, dexieMethods] as const;
}
