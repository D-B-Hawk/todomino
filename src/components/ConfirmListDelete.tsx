import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useOnClickOutside } from "../hooks";

export interface ConfirmListDeleteProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  onConfirmDelete: () => void;
  onOutsidePopupClick: () => void;
}

export function ConfirmListDelete(props: ConfirmListDeleteProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "onConfirmDelete",
    "onOutsidePopupClick",
  ]);
  let divRef: HTMLDivElement | undefined;

  useOnClickOutside(() => divRef, local.onOutsidePopupClick);

  return (
    <div
      ref={divRef}
      class={twMerge("flex flex-col p-4 bg-white rounded-md", local.class)}
      {...rest}
    >
      <p>Are you sure you want to delete this list?</p>
      <button onClick={local.onConfirmDelete}>Im sure</button>
    </div>
  );
}
