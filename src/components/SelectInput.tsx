import { For, Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export type SelectOption = { id: string | number; value: string };

export interface SelectInputProps
  extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]; // for whatever reason options is not listed as an attribute in JSX.SelectHTMLAttributes
  withBlankOption?: boolean;
  labelProps?: JSX.LabelHTMLAttributes<HTMLLabelElement> & { label: string };
}
export function SelectInput(props: SelectInputProps) {
  const [localProps, rest] = splitProps(props, [
    "class",
    "labelProps",
    "withBlankOption",
    "options",
  ]);

  return (
    <>
      <Show when={localProps.labelProps}>
        {(labelProps) => {
          const [lp, restOfLabelProps] = splitProps(labelProps(), [
            "class",
            "label",
          ]);
          return (
            <label
              class={twMerge("flex gap-1 items-center", lp.class)}
              {...restOfLabelProps}
            >
              {lp.label}
              <select
                class={twMerge("border rounded-sm px-4 py-2", localProps.class)}
                {...rest}
              >
                <Show when={localProps.withBlankOption}>
                  <option></option>
                </Show>
                <For each={localProps.options}>
                  {(option) => (
                    <option value={option.id}>{option.value}</option>
                  )}
                </For>
              </select>
            </label>
          );
        }}
      </Show>
      <Show when={!localProps.labelProps}>
        <select
          class={twMerge("border rounded-sm px-4 py-2", localProps.class)}
          {...props}
        >
          <Show when={localProps.withBlankOption}>
            <option></option>
          </Show>
          <For each={localProps.options}>
            {(option) => <option value={option.id}>{option.value}</option>}
          </For>
        </select>
      </Show>
    </>
  );
}
