import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

import { ICON_MAP } from "../constants";
import type { List } from "../types";
import { Dynamic } from "solid-js/web";

interface ListSelectorProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  list: List;
  todoCount: number;
  selected?: boolean;
}

export function ListSelector(props: ListSelectorProps) {
  const [localProps, buttonProps] = splitProps(props, [
    "list",
    "todoCount",
    "selected",
    "class",
  ]);

  return (
    <button
      class={twMerge(
        "flex flex-col gap-1 items-start min-w-[150px] p-2 rounded-md",
        localProps.selected ? "bg-gray-500" : "bg-gray-200",
        localProps.class,
      )}
      {...buttonProps}
    >
      <div class="flex justify-between items-center w-full">
        <div
          style={{ "background-color": localProps.list.color }}
          class="p-1 rounded-full border border-white"
        >
          <Dynamic
            component={ICON_MAP[localProps.list.icon]}
            class="stroke-white"
          />
        </div>

        <b>{localProps.todoCount}</b>
      </div>
      <b class="text-md font-semibold text-start">{localProps.list.name}</b>
    </button>
  );
}
