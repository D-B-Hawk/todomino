import { createEffect, createSignal, For, on, Show } from "solid-js";
import debounce from "lodash.debounce";
import { useDexieCtx } from "@/context";
import { TodoComp } from "@/components";
import type { Todo, TodoUpdates } from "@/types";
import { INITIAL_LIST_NAMES } from "@/constants/lists";
import { hasTodominoIndex, isEqualExcludingKeys } from "@/helpers";
import type { BulkTodoUpdate } from "@/db";
import { SECOND } from "@/constants/time";
import { updateOrRemoveFromObject } from "@/helpers/updateOrRemoveFromObject";

type CurrentTodosProps = {
  showCompletedTodos: boolean;
};

export function CurrentTodos(props: CurrentTodosProps) {
  const [editedTodo, setEditedTodo] = createSignal<Todo>();

  const [
    {
      lists,
      chosenList,
      chosenListCompleteTodos,
      chosenListIncompleteTodos,
      listsIncompleteTodosCount,
    },
    { deleteTodo, updateTodo, bulkUpdateTodos },
  ] = useDexieCtx();

  const [todosToUdpate, setTodosToUpdate] = createSignal<
    Record<Todo["id"], BulkTodoUpdate>
  >({});
  const [todosWithIdx, setTodosWithIdx] = createSignal<
    Record<Todo["id"], boolean>
  >({});

  const hasUpdateWithDominoIndex = () => Object.keys(todosWithIdx()).length > 0;

  const showIncompleteTodos = () => chosenList()?.name !== "completed";
  const showCompletedTodos = () =>
    props.showCompletedTodos || chosenList()?.name === "completed";

  const debouncedBulkTodo = debounce(
    async (updates: BulkTodoUpdate[], hasTodominoIndex: boolean) => {
      if (!updates.length) {
        return 0;
      }

      setTodosToUpdate({});

      if (hasTodominoIndex) {
        setTodosWithIdx({});
      }

      return await bulkUpdateTodos(updates, hasTodominoIndex);
    },
    2 * SECOND,
  );

  async function handleCheck(checked: boolean, todo: Todo) {
    const now = Date.now();
    const todoUpdates: TodoUpdates = {
      completedAt: checked ? now : undefined,
      dominoIndex: undefined,
      updatedAt: now,
    };

    // if both lists are visible handle the change immediately
    if (showCompletedTodos() && showIncompleteTodos()) {
      await updateTodo(todo.id, todoUpdates).catch((error) =>
        console.error("error from updateTodo in handleCheck =>", error),
      );
      return;
    }

    if (hasTodominoIndex(todo)) {
      setTodosWithIdx((curVal) =>
        updateOrRemoveFromObject(curVal, todo.id, true),
      );
    }

    // otherwise we will add/remove in the bulk updates map
    setTodosToUpdate((curVal) =>
      updateOrRemoveFromObject(curVal, todo.id, {
        key: todo.id,
        changes: todoUpdates,
      }),
    );
  }

  // whenever todos to update change submit a list of todos to update and
  // debounce the call to update until they are finished checking off everything
  createEffect(
    on(
      todosToUdpate,
      (updates) => {
        const updatesArray = Object.values(updates);
        debouncedBulkTodo(updatesArray, hasUpdateWithDominoIndex());
      },
      { defer: true },
    ),
  );

  // flush debounce and submit updates right away when changing the list
  createEffect(
    on(
      chosenList,
      () => {
        debouncedBulkTodo.flush();
      },
      { defer: true },
    ),
  );

  function handleClickOutside(currentTodo: Todo) {
    const edited = editedTodo();
    if (!edited) return;

    if (!isEqualExcludingKeys(edited, currentTodo, [])) {
      const updatedTodo: Todo = {
        ...edited,
        description: edited.description || "New reminder", // give default,
        updatedAt: Date.now(),
      };

      updateTodo(updatedTodo.id, updatedTodo).catch((error) => {
        console.error("Error from updateTodo in handleClickOutside", error);
      });
    }
    setEditedTodo(undefined);
  }

  const showListPicker = () => lists().length > INITIAL_LIST_NAMES.length;

  const handleUpdateTodomino = (todo: Todo) => {
    const todoToEdit = editedTodo() ?? todo;
    const previousDominoIndex = todo.dominoIndex;

    // if both conditons below do not succeed, index will default
    // to the next available index
    let nextDominoIndex: Todo["dominoIndex"] =
      listsIncompleteTodosCount()["todomino"];

    // if todo previously had a dominoIndex, remove it
    if (hasTodominoIndex(todoToEdit)) {
      nextDominoIndex = undefined;
      // if there was a previous index, place it back
    } else if (previousDominoIndex) {
      nextDominoIndex = previousDominoIndex;
    }

    setEditedTodo({ ...todoToEdit, dominoIndex: nextDominoIndex });
  };
  // TODO: Make func to keep repeat DRY
  return (
    <>
      <Show when={showIncompleteTodos()}>
        <For each={chosenListIncompleteTodos()}>
          {(todo) => (
            <TodoComp
              todo={todo}
              onCheck={(checked) => handleCheck(checked, todo)}
              onDelete={() => deleteTodo(todo)}
              onUpdateDescription={(description) =>
                setEditedTodo({ ...todo, description })
              }
              onUpdateDueDate={(dueDate) => setEditedTodo({ ...todo, dueDate })}
              onUpdateListName={(list) => setEditedTodo({ ...todo, list })}
              onClickOutside={() => handleClickOutside(todo)}
              showListPicker={showListPicker()}
              onUpdateTodomino={() => handleUpdateTodomino(todo)}
            />
          )}
        </For>
      </Show>
      <Show when={showCompletedTodos()}>
        <For each={chosenListCompleteTodos()}>
          {(todo) => (
            <TodoComp
              todo={todo}
              onCheck={(checked) => handleCheck(checked, todo)}
              onDelete={() => deleteTodo(todo)}
              onUpdateDescription={(description) =>
                setEditedTodo({ ...todo, description })
              }
              onUpdateDueDate={(dueDate) => setEditedTodo({ ...todo, dueDate })}
              onUpdateListName={(list) => setEditedTodo({ ...todo, list })}
              onClickOutside={() => handleClickOutside(todo)}
              showListPicker={showListPicker()}
              onUpdateTodomino={() => handleUpdateTodomino(todo)}
            />
          )}
        </For>
      </Show>
    </>
  );
}
