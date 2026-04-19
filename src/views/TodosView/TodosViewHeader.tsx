import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

import { PICKER_COLORS } from "@/constants/colors";
import { isReadOnlyListName } from "@/helpers";
import { useDexieCtx } from "@/context";

interface TodosViewHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  onHideShowClick: () => void;
  showCompletedTodos: boolean;
}

export function TodosViewHeader(props: TodosViewHeaderProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "onHideShowClick",
    "showCompletedTodos",
  ]);

  const [{ chosenList, chosenListCompleteTodos }] = useDexieCtx();

  const completeTodosLength = () => chosenListCompleteTodos().length;

  const chosenListColor = () => {
    const presentChosenList = chosenList();
    if (presentChosenList) {
      return PICKER_COLORS[presentChosenList.color];
    }
    return PICKER_COLORS["BLUE"];
  };

  return (
    <div
      class={twMerge("flex flex-col gap-4 p-4 shadow", local.class)}
      {...rest}
    >
      <Show when={chosenList()}>
        {(list) => (
          <h1 class="text-3xl font-bold" style={{ color: chosenListColor() }}>
            {list().name}
          </h1>
        )}
      </Show>
      <Show
        when={
          !isReadOnlyListName(chosenList()?.name) && !!completeTodosLength()
        }
      >
        <div class="flex justify-between">
          <span>{completeTodosLength()} Completed</span>

          <button
            class="cursor-pointer"
            onClick={local.onHideShowClick}
            style={{ color: chosenListColor() }}
          >
            {local.showCompletedTodos ? "Hide" : "Show"}
          </button>
        </div>
      </Show>
    </div>
  );
}
