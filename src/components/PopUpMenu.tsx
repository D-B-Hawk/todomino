import {
  Show,
  createEffect,
  createSignal,
  on,
  splitProps,
  type JSX,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { computePosition, offset } from "@floating-ui/dom";
import { IconButton } from "./IconButton";
import { useToggle } from "@/hooks";
import { OnClickOutsideContainer } from "./OnClickOutsideContainer";

export function PopUpMenu(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [menuOpen, { toggle }, showMenu] = useToggle();

  const [menuEl, setMenuEl] = createSignal<HTMLDivElement>();
  const [buttonEl, setButtonEl] = createSignal<HTMLButtonElement>();

  createEffect(
    on(
      menuEl,
      (menu) => {
        const button = buttonEl();
        if (menu && button) {
          computePosition(button, menu, {
            placement: "left",
            middleware: [offset(40)],
          }).then(({ x, y }) => {
            Object.assign(menu.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });
        }
      },
      { defer: true },
    ),
  );

  function handleClickOutside() {
    setMenuEl(undefined);
    showMenu(false);
  }

  function handleClick() {
    if (menuOpen()) {
      return;
    }
    toggle();
  }

  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div class={twMerge("relative", local.class)} {...rest}>
      <IconButton
        onClick={handleClick}
        ref={setButtonEl}
        iconProps={{ icon: "ELLIPSIS", class: "h-4" }}
      />
      <Show when={menuOpen()}>
        <OnClickOutsideContainer
          onDivMount={setMenuEl}
          onClickOutside={handleClickOutside}
          class="absolute max-w-fit top-0 left-0 p-2 border bg-white"
        >
          {props.children}
        </OnClickOutsideContainer>
      </Show>
    </div>
  );
}
