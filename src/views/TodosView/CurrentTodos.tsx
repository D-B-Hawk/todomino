import { createSignal, For, Show } from "solid-js";
import { useDexieCtx } from "@/context";
// import { useAsyncDebounce } from "@/hooks";
import { TodoComp } from "@/components";
import type { Todo } from "@/types";
import { INITIAL_LIST_NAMES } from "@/constants/lists";
import { hasTodominoIndex, isEqualExcludingKeys } from "@/helpers";

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
    { deleteTodo, updateTodo },
  ] = useDexieCtx();

  const showIncompleteTodos = () => chosenList()?.name !== "completed";
  const showCompletedTodos = () =>
    props.showCompletedTodos || chosenList()?.name === "completed";

  async function handleCheck(checked: boolean, todo: Todo) {
    // if both lists are visible handle the change immediately
    if (showCompletedTodos() && showIncompleteTodos()) {
      const now = Date.now();
      const updatedTodo: Todo = {
        ...todo,
        completedAt: checked ? now : undefined,
        updatedAt: now,
      };

      await updateTodo(updatedTodo).catch((error) =>
        console.error("error from updateTodo in handleCheck =>", error),
      );
    }
    // otherwise place todos that are being checked off into a queue
    // console.log("doing nothing since they should be placed in queue");
  }

  function handleClickOutside(currentTodo: Todo) {
    const edited = editedTodo();
    if (!edited) return;

    if (!isEqualExcludingKeys(edited, currentTodo, [])) {
      const updatedTodo: Todo = {
        ...edited,
        description: edited.description || "New reminder", // give default,
        updatedAt: Date.now(),
      };

      updateTodo(updatedTodo).catch((error) => {
        console.error("Error from updateTodo in handleClickOutside", error);
      });
    }
    setEditedTodo(undefined);
  }

  const showListPicker = () => lists().length > INITIAL_LIST_NAMES.length;

  // const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

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
