import type { Component } from "solid-js";
import { twMerge } from "tailwind-merge";

interface TodoProps {
  class?: string;
}

export const Todo: Component<TodoProps> = (props) => {
  return (
    <div
      class={twMerge(
        "flex w-80 h-24 rounded-lg border border-blue-400",
        props.class
      )}
    >
      big ol todo
    </div>
  );
};
