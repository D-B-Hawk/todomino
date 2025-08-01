import { For } from "solid-js";
import type { ListName } from "@/types";
import { ListSelector, Icon } from "@/components";
import { useDexieCtx } from "@/context";

type ListViewProps = {
  onAddList: () => void;
  onDeleteList: (listName: ListName) => void;
};

export function ListView(props: ListViewProps) {
  const [{ lists, listsTodoCount, chosenList }, { chooseList }] = useDexieCtx();

  return (
    <div
      class="bg-silverback/50 border-r border-silverback 
      flex flex-col shrink-0 items-center justify-between p-4 
      gap-4 w-[350px] overflow-y-auto"
    >
      <div class="grid grid-cols-2 gap-2">
        <For each={lists()}>
          {(list) => (
            <ListSelector
              list={list}
              todoCount={listsTodoCount()[list.name]}
              selected={chosenList()?.name === list.name}
              onClick={() => chooseList(list)}
              onDeleteList={props.onDeleteList}
            />
          )}
        </For>
      </div>
      <button onClick={props.onAddList} class="flex gap-2 self-start">
        <Icon icon="PLUS_CIRCLE" class="w-6 h-6" />
        <span>Add List</span>
      </button>
    </div>
  );
}
