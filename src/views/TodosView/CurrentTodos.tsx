import { createSignal, For } from "solid-js";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce } from "@/hooks";
import { TodoComp } from "@/components";
import type { Todo } from "@/types";
import { deepEqual } from "@/helpers";

type CurrentTodosProps = {
  showComplete: boolean;
};

export function CurrentTodos(props: CurrentTodosProps) {
  const [editedTodo, setEditedTodo] = createSignal<Todo>();

  const [
    { listsCompleteIncompleteTodos, chosenList },
    { handleTodoCheck, deleteTodo, updateTodo },
  ] = useDexieCtx();

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  function handleClickOutside(currentTodo: Todo) {
    const edited = editedTodo();
    if (!edited) return;

    if (!deepEqual(edited, currentTodo)) {
      const updatedTodo: Todo = {
        ...edited,
        updatedAt: Date.now(),
        description: edited.description || "New reminder", // give default,
      };

      updateTodo(updatedTodo).catch((error) => {
        console.error(error);
      });

      setEditedTodo(undefined);
    }
  }

  const todos = () => {
    const { complete, incomplete } =
      listsCompleteIncompleteTodos()[chosenList().name];
    if (chosenList()?.name === "completed") {
      return complete;
    }
    if (props.showComplete) {
      return [...incomplete, ...complete];
    }
    return incomplete;
  };

  const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

  return (
    <For each={todos()}>
      {(todo) => (
        <TodoComp
          todo={todo}
          onCheck={(checked) => debouncedCheck(checked, todo)}
          onDelete={() => deleteTodo(todo)}
          onUpdateDescription={(description) =>
            setEditedTodo({ ...todo, description })
          }
          onUpdateDueDate={(dueDate) => setEditedTodo({ ...todo, dueDate })}
          onUpdateListName={(list) => setEditedTodo({ ...todo, list })}
          onClickOutside={() => handleClickOutside(todo)}
        />
      )}
    </For>
  );
}
