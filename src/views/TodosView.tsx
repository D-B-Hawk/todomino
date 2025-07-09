import { For, Show } from "solid-js";
import type { Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce } from "@/hooks";
import { isReadOnlyListName } from "@/helpers";
import { TodoComp, TodoForm, ScrollableContainer } from "@/components";
import { PICKER_COLORS } from "@/constants/colors";

export function TodosView() {
  const [{ chosenListTodos, chosenList }, { handleTodoCheck }] = useDexieCtx();

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

  return (
    <div class="flex flex-col w-full">
      {/* Header */}
      <Show when={chosenList()}>
        {(list) => (
          <div class="flex flex-col p-4">
            <h1
              class="text-3xl font-bold"
              style={{ color: PICKER_COLORS[list().color] }}
            >
              {list().name}
            </h1>
          </div>
        )}
      </Show>
      <ScrollableContainer class="p-4 gap-2">
        <For each={chosenListTodos()}>
          {(todo) => (
            <TodoComp
              todo={todo}
              onCheck={(checked) => debouncedCheck(checked, todo)}
            />
          )}
        </For>
        <Show when={!isReadOnlyListName(chosenList()?.name)}>
          <TodoForm class="w-fit border p-4 px-6 rounded-2xl" />
        </Show>
      </ScrollableContainer>
    </div>
  );
}
