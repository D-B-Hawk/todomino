import { For } from "solid-js";
import { ListSelector } from "../components/ListSelector";
import { AppIconKey } from "../constants";
import { Icon } from "../components/Icon";
import type { ListName } from "../types";
import { useDexieCtx } from "../context/Dexie/DexieCtx";

type ListViewProps = {
  onAddList: () => void;
  onDeleteList: (listName: ListName) => void;
};

export function ListView(props: ListViewProps) {
  const [{ lists, listsTodoCount, chosenListName }, { chooseList }] =
    useDexieCtx();

  return (
    <div class="bg-silverback/50 border-r border-silverback flex flex-col items-center justify-between p-4 gap-4 w-96 overflow-y-auto">
      <div class="flex flex-wrap gap-2">
        <For each={lists()}>
          {(list) => (
            <ListSelector
              list={list}
              todoCount={listsTodoCount()[list.name]}
              selected={chosenListName() === list.name}
              onClick={() => chooseList(list.name)}
              onDeleteList={props.onDeleteList}
            />
          )}
        </For>
      </div>
      <button onClick={props.onAddList} class="flex gap-2 self-start">
        <Icon icon={AppIconKey.PLUS_CIRCLE} class="w-6 h-6" />
        <span>Add List</span>
      </button>
    </div>
  );
}
