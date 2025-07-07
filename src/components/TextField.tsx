import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

interface TextFieldProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  labelProps?: JSX.LabelHTMLAttributes<HTMLLabelElement> & { label: string };
}

export function TextField(props: TextFieldProps) {
  const [local, inputProps] = splitProps(props, ["class", "labelProps"]);
  return (
    <>
      <Show when={local.labelProps}>
        {(labelProps) => {
          const [lp, restOfLabelProps] = splitProps(labelProps(), [
            "class",
            "label",
          ]);
          return (
            <label
              class={twMerge("flex flex-col gap-1", lp.class)}
              {...restOfLabelProps}
            >
              {lp.label}
              <input
                class={twMerge(
                  "rounded-md border-2 px-4 py-2 w-full",
                  local.class,
                )}
                type="text"
                {...inputProps}
              />
            </label>
          );
        }}
      </Show>
      <Show when={!local.labelProps}>
        <input
          class={twMerge("rounded-md border-2 px-4 py-2 w-full", local.class)}
          type="text"
          {...inputProps}
        />
      </Show>
    </>
  );
}
