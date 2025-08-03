import { Show, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { IconButton } from "./IconButton";
import { useToggle } from "@/hooks";
import { OnClickOutsideContainer } from "./OnClickOutsideContainer";

interface PopUpMenuProps extends JSX.HTMLAttributes<HTMLDivElement> {
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

  const [local, rest] = splitProps(props, ["class", "disabled"]);

  return (
    <div class={twMerge("relative", local.class)} {...rest}>
      <IconButton
        onClick={handleClick}
        disabled={local.disabled}
        iconProps={{ icon: "ELLIPSIS", class: "h-4" }}
      />
      <Show when={menuOpen()}>
        <OnClickOutsideContainer
          onClickOutside={toggle}
          class="absolute max-w-fit -top-5 right-5 p-2 border bg-white"
        >
          {props.children}
        </OnClickOutsideContainer>
      </Show>
    </div>
  );
}
