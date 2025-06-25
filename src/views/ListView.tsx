import { For } from "solid-js";
import { ListSelector } from "../components/ListSelector";
import type { ListCount, ListName } from "../types";
import PlusAddIcon from "../assets/plus-circle.svg";

type ListViewProps = {
  listCounts: ListCount[];
  selectedList: ListName | undefined;
  onAddList: () => void;
  onChooseList: (listName: ListName) => void;
};

export function ListView(props: ListViewProps) {
  return (
    <div class="flex flex-col items-center justify-between p-4 w-96 border-2 border-orange-400">
      <div class="flex items-center justify-center flex-wrap gap-2">
        <For each={props.listCounts}>
          {({ list, todoCount }) => (
            <ListSelector
              list={list}
              todoCount={todoCount}
              selected={props.selectedList === list.name}
              onClick={() => props.onChooseList(list.name)}
            />
          )}
        </For>
      </div>
      <button onClick={props.onAddList} class="flex gap-2">
        <PlusAddIcon />
        <span>Add List</span>
      </button>
    </div>
  );
}
