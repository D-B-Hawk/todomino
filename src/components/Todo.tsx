import { Show, type Component } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { Todo } from "../types";
import { truncateText } from "../helpers/truncateText";

interface TodoProps {
  todo: Todo;
  onCheck: (checked: boolean) => void;
  class?: string;
}

export const TodoComp: Component<TodoProps> = (props) => {
  const shortenedUUID = truncateText(props.todo.id, 8);
  return (
    <div
      class={twMerge(
        "relative flex w-80 py-7 rounded-lg border border-blue-400",
        props.class
      )}
    >
      <span class="absolute top-1 right-1 text-gray-300">{shortenedUUID}</span>
      <div class="flex items-center p-2 border border-red-300">
        <input
          type="checkbox"
          on:change={(e) => props.onCheck(e.target.checked)}
          checked={!!props.todo.completedAt}
        />
      </div>
      <div class="flex flex-1 items-center border border-purple-300">
        {props.todo.description}
      </div>
      <Show when={props.todo.dependsOn}>
        <span class="absolute bottom-1 left-1 text-gray-300">
          Depends On:{truncateText(props.todo.dependsOn || "", 8)}
        </span>
      </Show>
    </div>
  );
};
