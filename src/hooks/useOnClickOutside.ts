import { onCleanup, onMount, type Accessor } from "solid-js";

type MaybeElement = HTMLElement | undefined | null;
type PossibleEvent = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends MaybeElement>(
  ref: Accessor<T>,
  handler: (event: PossibleEvent) => void,
) {
  const listener = (event: PossibleEvent) => {
    if (!ref() || withinBounds(ref(), event)) {
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

function withinBounds(element: MaybeElement, event: PossibleEvent) {
  return (
    element && event.target instanceof Node && element.contains(event.target)
  );
}
