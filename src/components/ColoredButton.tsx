import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

export function ColoredButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <button
      class={twMerge("bg-blue-400 text-white rounded-md p-2", local.class)}
      {...rest}
    />
  );
}
