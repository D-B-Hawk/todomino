import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { IconButton, type IconButtonProps } from "./IconButton";
import { useToggle } from "@/hooks";
import { OnClickOutsideContainer } from "./OnClickOutsideContainer";

interface PopUpMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
  iconButtonProps?: IconButtonProps;
  clickOutsideContainerClass?: string;
  disabled?: boolean;
}

export function PopUpMenu(props: PopUpMenuProps) {
  const [menuOpen, { toggle }] = useToggle();

  const [local, buttonProps, container, rest] = splitProps(
    props,
    ["class", "disabled"],
    ["iconButtonProps"],
    ["clickOutsideContainerClass"],
  );

  return (
    <div class={twMerge("relative flex", local.class)} {...rest}>
      <IconButton
        class={twMerge(
          "gap-1 p-1 rounded-md items-center",
          buttonProps.iconButtonProps?.class,
        )}
        onClick={() => {
          if (menuOpen()) {
            return;
          }
          toggle();
        }}
        disabled={local.disabled}
        iconProps={{
          icon: buttonProps?.iconButtonProps?.iconProps?.icon ?? "ELLIPSIS",
          class: twMerge("w-4", buttonProps?.iconButtonProps?.iconProps?.class),
        }}
      >
        {buttonProps?.iconButtonProps?.children}
      </IconButton>
      <Show when={menuOpen()}>
        <OnClickOutsideContainer
          onClickOutside={toggle}
          class={twMerge(
            "absolute max-w-fit -top-5 right-5 z-10",
            container.clickOutsideContainerClass,
          )}
        >
          {props.children}
        </OnClickOutsideContainer>
      </Show>
    </div>
  );
}
