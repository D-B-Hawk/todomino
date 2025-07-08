import { createSignal, Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

type CheckboxEvent = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

interface CheckboxProps
  extends Omit<
    JSX.InputHTMLAttributes<HTMLInputElement>,
    "type" | "on:change" | "onchange" | "onChange"
  > {
  onCheck?: (e: CheckboxEvent) => void;
}

export function Checkbox(props: CheckboxProps) {
  const [local, rest] = splitProps(props, ["class"]);

  const [checked, setChecked] = createSignal(rest.checked);

  function handleChange(e: CheckboxEvent) {
    setChecked(e.target.checked);
    props.onCheck?.(e);
  }

  return (
    <label
      class={twMerge(
        "flex justify-center items-center border h-4 w-4 rounded-full cursor-pointer",
        checked() && "border-blue-500",
        local.class,
      )}
    >
      <input
        class="hidden"
        type="checkbox"
        checked={checked()}
        onChange={handleChange}
        {...rest}
      />
      <Show when={checked()}>
        <div class="h-2.5 w-2.5 bg-blue-500 rounded-full" />
      </Show>
    </label>
  );
}
