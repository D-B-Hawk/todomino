import { For } from "solid-js";
import { useDexieCtx } from "@/context";
import { isReadOnlyListName } from "@/helpers";
import { PopUpMenu } from "./PopUpMenu";
import type { ListName } from "@/types";
import { PICKER_COLORS } from "@/constants/colors";

type ListPickerProps = {
  todoListName: ListName;
  onListOptionClick: (listName: ListName) => void;
};

export function ListPicker(props: ListPickerProps) {
  const [{ lists }] = useDexieCtx();

  const listOptions = () =>
    lists().filter(
      (list) =>
        !isReadOnlyListName(list.name) && list.name !== props.todoListName,
    );

  return (
    <PopUpMenu
      class="p-1 rounded-md h-full"
      clickOutsideContainerClass="left-1 top-10"
      iconButtonProps={{
        iconProps: {
          icon: "TRELLO",
        },
        children: props.todoListName,
        class: "bg-black/5 hover:bg-black/15",
      }}
    >
      <menu class="flex flex-col gap-1">
        <For each={listOptions()}>
          {(list) => (
            <li>
              <button
                type="button"
                class="flex flex-1 p-2 text-white rounded-md text-nowrap cursor-pointer"
                style={{ "background-color": PICKER_COLORS[list.color] }}
                onClick={(e) => {
                  e.stopImmediatePropagation();
                  props.onListOptionClick(list.name);
                }}
              >
                {list.name}
              </button>
            </li>
          )}
        </For>
      </menu>
    </PopUpMenu>
  );
}
