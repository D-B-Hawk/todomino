import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { IconButton } from "./IconButton";
import { useToggle } from "@/hooks";
import { OnClickOutsideContainer } from "./OnClickOutsideContainer";
import type { IconProps } from "./Icon";

interface PopUpMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
  iconProps?: IconProps;
  clickOutsideContainerClass?: string;
  disabled?: boolean;
}

export function PopUpMenu(props: PopUpMenuProps) {
  const [menuOpen, { toggle }] = useToggle();

  function handleClick() {
    if (menuOpen()) {
      return;
    }
    toggle();
  }

  const [local, icon, container, rest] = splitProps(
    props,
    ["class", "disabled"],
    ["iconProps"],
    ["clickOutsideContainerClass"],
  );

  return (
    <div class={twMerge("relative", local.class)} {...rest}>
      <IconButton
        onClick={handleClick}
        disabled={local.disabled}
        iconProps={{
          icon: icon.iconProps?.icon ?? "ELLIPSIS",
          class: twMerge("h-4", icon.iconProps?.class),
        }}
      />
      <Show when={menuOpen()}>
        <OnClickOutsideContainer
          onClickOutside={toggle}
          class={twMerge(
            "absolute max-w-fit -top-5 right-5 p-2 border bg-white",
            container.clickOutsideContainerClass,
          )}
        >
          {props.children}
        </OnClickOutsideContainer>
      </Show>
    </div>
  );
}
