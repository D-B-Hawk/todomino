import { Show, splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { twMerge } from "tailwind-merge";

import { isConstantListName } from "@/helpers";
import type { List, ListName } from "@/types";
import { IconButton } from "./IconButton";
import { ICON_MAP } from "@/constants/icons";
import { PICKER_COLORS } from "@/constants/colors";

interface ListSelectorProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  list: List;
  todoCount: number;
  onDeleteList: (listName: ListName) => void;
  selected?: boolean;
}

export function ListSelector(props: ListSelectorProps) {
  const [localProps, buttonProps] = splitProps(props, [
    "list",
    "todoCount",
    "onDeleteList",
    "selected",
    "class",
  ]);

  return (
    <button
      class={twMerge(
        "group relative flex flex-col gap-1 items-start min-w-[150px] p-2 rounded-md",
        localProps.selected && "text-white",
        localProps.class,
      )}
      style={{
        "background-color": localProps.selected
          ? PICKER_COLORS[localProps.list.color]
          : "var(--color-silverback)",
      }}
      {...buttonProps}
    >
      <Show when={!isConstantListName(localProps.list.name)}>
        <IconButton
          class="absolute -top-2 -right-2 p-0 hidden group-hover:block"
          iconProps={{
            icon: "PLUS_CIRCLE",
            class: "rotate-45 h-5 w-5 rounded-full stroke-white",
            style: { "background-color": PICKER_COLORS[localProps.list.color] },
          }}
          onClick={() => localProps.onDeleteList(localProps.list.name)}
        />
      </Show>
      <div class="flex justify-between items-center w-full">
        <div
          style={{
            "background-color": localProps.selected
              ? "white"
              : PICKER_COLORS[localProps.list.color],
          }}
          class="p-1 rounded-full"
        >
          <Dynamic
            component={ICON_MAP[localProps.list.icon]}
            style={{
              stroke: localProps.selected
                ? PICKER_COLORS[localProps.list.color]
                : "white",
            }}
          />
        </div>

        <b>{localProps.todoCount}</b>
      </div>
      <b class="text-md font-semibold text-start">{localProps.list.name}</b>
    </button>
  );
}
