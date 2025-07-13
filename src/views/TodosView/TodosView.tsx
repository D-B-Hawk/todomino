import { createEffect, For, Show } from "solid-js";
import type { Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce, useToggle } from "@/hooks";
import { isReadOnlyListName } from "@/helpers";
import { TodoComp, TodoForm, ScrollableContainer } from "@/components";
import { TodosViewHeader } from "./TodosViewHeader";

export function TodosView() {
  const [{ chosenListTodos, chosenList }, { handleTodoCheck, deleteTodo }] =
    useDexieCtx();
  const [showComplete, { toggle }, setShowComplete] = useToggle();

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  // every time a different list is chosen make sure we
  // are not showing the completed todos if they toggled that
  // option on before
  createEffect(() => {
    chosenList();
    setShowComplete(false);
  });

  const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

  const todos = () => {
    const { complete, incomplete } = chosenListTodos();
    if (chosenList()?.name === "completed") {
      return complete;
    }
    if (showComplete()) {
      return [...incomplete, ...complete];
    }
    return incomplete;
  };

  return (
    <div class="flex flex-col w-full">
      <Show when={chosenList()}>
        {(list) => (
          <TodosViewHeader
            list={list()}
            completedTodos={chosenListTodos().complete.length}
            onHideShowClick={toggle}
            showComplete={showComplete()}
          />
        )}
      </Show>
      <ScrollableContainer class="p-4 gap-2">
        <For each={todos()}>
          {(todo) => (
            <TodoComp
              todo={todo}
              onCheck={(checked) => debouncedCheck(checked, todo)}
              onDelete={() => deleteTodo(todo)}
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
