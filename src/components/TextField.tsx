import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export function TextField(props: JSX.SelectHTMLAttributes<HTMLInputElement>) {
  const [local, inputProps] = splitProps(props, ["class"]);
  return (
    <input
      class={twMerge("rounded-md border-2 px-4 py-2 w-full", local.class)}
      type="text"
      {...inputProps}
    />
  );
}
