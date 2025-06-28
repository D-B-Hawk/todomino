import { For } from "solid-js";
import { ListSelector } from "../components/ListSelector";
import { AppIconKey } from "../constants";
import { Icon } from "../components/Icon";
import { useDexie } from "../hooks";

type ListViewProps = {
  onAddList: () => void;
};

export function ListView(props: ListViewProps) {
  const [{ lists, listsTodoCount, chosenListName }, { chooseList }] =
    useDexie();

  return (
    <div class="flex flex-col items-center justify-between p-4 w-96 border-2 border-orange-400">
      <div class="flex flex-wrap gap-2 border border-green-200">
        <For each={lists()}>
          {(list) => (
            <ListSelector
              list={list}
              todoCount={listsTodoCount()[list.name]}
              selected={chosenListName() === list.name}
              onClick={() => chooseList(list.name)}
            />
          )}
        </For>
      </div>
      <button onClick={props.onAddList} class="flex gap-2">
        <Icon icon={AppIconKey.PLUS_CIRCLE} class="w-6 h-6" />
        <span>Add List</span>
      </button>
    </div>
  );
}
