import type { JSX } from "solid-js/jsx-runtime";
import type { List } from "../types";
import { splitProps } from "solid-js";
import { ICON_MAP } from "../constants";

interface ListSelectorProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  list: List;
  count: number;
  selected?: boolean;
  class?: string;
}

export function ListSelector(props: ListSelectorProps) {
  const [localProps, buttonProps] = splitProps(props, [
    "list",
    "count",
    "selected",
  ]);
  const Icon = ICON_MAP[localProps.list.icon];

  return (
    <button
      classList={{
        "bg-opacity-100": localProps.selected,
        "bg-opacity-30": !localProps.selected,
      }}
      class="flex flex-col gap-1 items-start min-w-[150px] p-2 rounded-md bg-gray-400"
      {...buttonProps}
    >
      <div class="flex justify-between items-center w-full">
        <div class={`bg-[${localProps.list.color}] p-1 rounded-full`}>
          <Icon class="stroke-white" />
        </div>

        <b>{localProps.count}</b>
      </div>
      <b class="text-md font-semibold">{localProps.list.name}</b>
    </button>
  );
}
