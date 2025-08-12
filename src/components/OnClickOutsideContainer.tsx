import { createEffect, createSignal, on, splitProps, type JSX } from "solid-js";
import { useOnClickOutside } from "@/hooks";

export interface OnClickOutsideContainerProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "ref"> {
  onClickOutside: () => void;
  onDivMount?: (div: HTMLDivElement | undefined) => void;
}

export function OnClickOutsideContainer(props: OnClickOutsideContainerProps) {
  const [local, rest] = splitProps(props, ["onClickOutside", "onDivMount"]);

  const [divRef, setDivRef] = createSignal<HTMLDivElement>();

  createEffect(on(divRef, (ref) => local.onDivMount?.(ref), { defer: true }));

  useOnClickOutside(divRef, local.onClickOutside);

  return <div ref={setDivRef} {...rest} />;
}
