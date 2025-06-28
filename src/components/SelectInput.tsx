import { For, Show, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export type SelectOption = { id: string | number; value: string };

export interface SelectInputProps
  extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]; // for whatever reason options is not listed as an attribute in JSX.SelectHTMLAttributes
  withBlankOption?: boolean;
}
export function SelectInput(props: SelectInputProps) {
  return (
    <select class={twMerge("rounded-sm px-4 py-2", props.class)} {...props}>
      <Show when={props.withBlankOption}>
        <option></option>
      </Show>
      <For each={props.options}>
        {(option) => <option value={option.id}>{option.value}</option>}
      </For>
    </select>
  );
}
