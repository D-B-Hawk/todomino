import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { IconButton, type IconButtonProps } from "./IconButton";
import { useToggle } from "@/hooks";
import { OnClickOutsideContainer } from "./OnClickOutsideContainer";

interface PopUpMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
  buttonIcon?: IconButtonProps["iconProps"]["icon"];
  buttonLabel?: string;
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

  const [local, buttonProps, container, rest] = splitProps(
    props,
    ["class", "disabled"],
    ["buttonIcon", "buttonLabel"],
    ["clickOutsideContainerClass"],
  );

  return (
    <div class={twMerge("relative flex", local.class)} {...rest}>
      <IconButton
        class="gap-1 items-center"
        onClick={handleClick}
        disabled={local.disabled}
        iconProps={{
          icon: buttonProps.buttonIcon ?? "ELLIPSIS",
          class: "w-4",
        }}
      >
        <Show when={buttonProps.buttonLabel}>{buttonProps.buttonLabel}</Show>
      </IconButton>
      <Show when={menuOpen()}>
        <OnClickOutsideContainer
          onClickOutside={toggle}
          class={twMerge(
            "absolute max-w-fit -top-5 right-5 p-2 border bg-white z-10",
            container.clickOutsideContainerClass,
          )}
        >
          {props.children}
        </OnClickOutsideContainer>
      </Show>
    </div>
  );
}
