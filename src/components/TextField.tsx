import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

type TextFieldProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type">;

export function TextField(props: TextFieldProps) {
  const [local, inputProps] = splitProps(props, ["class"]);
  return (
    <input
      class={twMerge("rounded-md border-2 px-4 py-2 w-full", local.class)}
      type="text"
      {...inputProps}
    />
  );
}
