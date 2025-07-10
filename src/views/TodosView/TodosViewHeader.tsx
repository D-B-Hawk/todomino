import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

import { PICKER_COLORS } from "@/constants/colors";
import { isReadOnlyListName } from "@/helpers";
import type { List } from "@/types";

interface TodosViewHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  list: List;
  completedTodos: number;
  onHideShowClick: () => void;
  showComplete: boolean;
}

export function TodosViewHeader(props: TodosViewHeaderProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "list",
    "completedTodos",
    "onHideShowClick",
    "showComplete",
  ]);

  return (
    <div
      class={twMerge("flex flex-col gap-4 p-4 shadow", local.class)}
      {...rest}
    >
      <h1
        class="text-3xl font-bold"
        style={{ color: PICKER_COLORS[local.list.color] }}
      >
        {local.list.name}
      </h1>
      <Show
        when={
          !isReadOnlyListName(local.list.name) ||
          local.list.name === "completed"
        }
      >
        <div class="flex justify-between">
          <span>{local.completedTodos} Completed</span>
          <Show when={!isReadOnlyListName(local.list.name)}>
            <button
              class="cursor-pointer"
              onClick={local.onHideShowClick}
              style={{ color: PICKER_COLORS[local.list.color] }}
            >
              {local.showComplete ? "Hide" : "Show"}
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}
