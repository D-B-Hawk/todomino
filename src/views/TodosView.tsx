import { For, Show } from "solid-js";
import type { Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce } from "@/hooks";
import { isReadOnlyListName } from "@/helpers";
import { TodoComp, TodoForm } from "@/components";

export function TodosView() {
  const [{ chosenListTodos, chosenListName }, { handleTodoCheck }] =
    useDexieCtx();

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

  return (
    <div class="flex flex-col overflow-y-auto gap-2 p-4">
      <For each={chosenListTodos()}>
        {(todo) => (
          <TodoComp
            todo={todo}
            onCheck={(checked) => debouncedCheck(checked, todo)}
          />
        )}
      </For>
      <Show when={!isReadOnlyListName(chosenListName())}>
        <div class="flex border-2 border-lime-200">
          <TodoForm />
        </div>
      </Show>
    </div>
  );
}
