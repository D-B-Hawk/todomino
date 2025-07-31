import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Icon, type IconProps } from "./Icon";

interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  iconProps: IconProps;
}

export function IconButton(props: IconButtonProps) {
  const [local, buttonProps] = splitProps(props, ["iconProps", "class"]);
  return (
    <button
      class={twMerge("rounded-full cursor-pointer", local.class)}
      type="button"
      {...buttonProps}
    >
      <Icon {...local.iconProps} />
      {props.children}
    </button>
  );
}
