import { createSignal, For } from "solid-js";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce } from "@/hooks";
import { TodoComp } from "@/components";
import type { Todo } from "@/types";

type CurrentTodosProps = {
  showComplete: boolean;
};

export function CurrentTodos(props: CurrentTodosProps) {
  const [editedTodo, setEditedTodo] = createSignal<Todo>();

  const [
    { chosenListTodos, chosenList },
    { handleTodoCheck, deleteTodo, updateTodo },
  ] = useDexieCtx();

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  async function handleClickOutside(currentTodo: Todo) {
    const edited = editedTodo();
    if (!edited) return;

    if (
      edited.description !== currentTodo.description ||
      edited.dueDate !== currentTodo.dueDate
    ) {
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
    const { complete, incomplete } = chosenListTodos();
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
          onClickOutside={() => handleClickOutside(todo)}
        />
      )}
    </For>
  );
}
