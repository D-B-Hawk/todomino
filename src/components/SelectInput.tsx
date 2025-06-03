import { For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge";

export type Option = { id: string | number; value: string };

export interface SelectInputProps
  extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]; // for whatever reason options is not listed as an attribute in JSX.SelectHTMLAttributes
  class?: string;
}

export function SelectInput(props: SelectInputProps) {
  return (
    <select class={twMerge("rounded-sm px-4 py-2", props.class)} {...props}>
      <option value=""></option>
      <For each={props.options}>
        {(option) => <option value={option.id}>{option.value}</option>}
      </For>
    </select>
  );
}
