import { For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

export type Option = { id: string | number; value: string };

export type SelectInputProps<O extends Option> = {
  selectValue: JSX.SelectHTMLAttributes<HTMLSelectElement>["value"];
  onSelectChange?: (value: string) => void;
  selectOptions: O[];
};

export function SelectInput<O extends Option>(props: SelectInputProps<O>) {
  return (
    <select
      class="rounded-sm px-4 py-2"
      on:change={(e) => props.onSelectChange?.(e.target.value)}
      value={props.selectValue}
    >
      <option value=""></option>
      <For each={props.selectOptions}>
        {(option) => <option value={option.id}>{option.value}</option>}
      </For>
    </select>
  );
}
