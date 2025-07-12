import { onCleanup, onMount, type Accessor } from "solid-js";

type MaybeElement<T extends HTMLElement = HTMLElement> =
  | T
  | null
  | undefined
  | ((el: T) => void);

type PossibleEvent = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement>(
  ref: Accessor<MaybeElement<T>>,
  handler: (event: PossibleEvent) => void,
) {
  const listener = (event: PossibleEvent) => {
    const element = getElement(ref());
    if (!element || withinBounds(element, event)) {
      return;
    }
    handler(event);
  };

  onMount(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", listener);
    document.removeEventListener("touchstart", listener);
  });
}

function withinBounds(element: HTMLElement, event: PossibleEvent) {
  return (
    element && event.target instanceof Node && element.contains(event.target)
  );
}

function getElement<T extends HTMLElement>(maybe: MaybeElement<T>): T | null {
  return typeof maybe === "function" ? null : (maybe ?? null);
}
