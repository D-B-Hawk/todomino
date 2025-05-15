import type { Component } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { Todo } from "../types";

interface TodoProps {
  todo: Todo;
  onCheck: (checked: boolean) => void;
  class?: string;
}

export const TodoComp: Component<TodoProps> = (props) => {
  return (
    <div
      class={twMerge(
        "flex w-80 h-24 rounded-lg border border-blue-400",
        props.class
      )}
    >
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
    </div>
  );
};
