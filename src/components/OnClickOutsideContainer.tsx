import { createEffect, createSignal, splitProps, type JSX } from "solid-js";
import { useOnClickOutside } from "@/hooks";

interface OnClickOutsideContainerProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "ref"> {
  onClickOutside: () => void;
  onDivMount?: (div: HTMLDivElement | undefined) => void;
}

export function OnClickOutsideContainer(props: OnClickOutsideContainerProps) {
  const [local, rest] = splitProps(props, ["onClickOutside", "onDivMount"]);

  const [divRef, setDivRef] = createSignal<HTMLDivElement>();

  createEffect(() => {
    local.onDivMount?.(divRef());
  });

  useOnClickOutside(divRef, local.onClickOutside);

  return <div ref={setDivRef} {...rest} />;
}
