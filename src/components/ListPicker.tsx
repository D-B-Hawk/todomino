import { For } from "solid-js";
import { useDexieCtx } from "@/context";
import { isReadOnlyListName } from "@/helpers";
import { PopUpMenu } from "./PopUpMenu";
import type { ListName } from "@/types";

type ListPickerProps = {
  todoListName: ListName;
  onListOptionClick: (listName: ListName) => void;
};

export function ListPicker(props: ListPickerProps) {
  const [{ lists }] = useDexieCtx();

  const listOptions = () =>
    lists().filter((list) => !isReadOnlyListName(list.name));

  return (
    <PopUpMenu
      class="border border-green-300"
      clickOutsideContainerClass="left-0 top-9 w-fit"
      buttonIcon="TRELLO"
      buttonLabel={props.todoListName}
    >
      <menu>
        <For each={listOptions()}>
          {(list) => (
            <li>
              <button
                class="border p-2 bg-red-500 text-white cursor-pointer"
                onClick={() => props.onListOptionClick(list.name)}
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
