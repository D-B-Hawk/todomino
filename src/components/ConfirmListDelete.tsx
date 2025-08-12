import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { ListName } from "@/types";
import { ColoredButton } from "./ColoredButton";
import { ClosableContainer } from "./ClosableContainer";

export interface ConfirmListDeleteProps
  extends JSX.HTMLAttributes<HTMLDivElement> {
  listName: ListName;
  onConfirmDelete: () => void;
  onOutsidePopupClick: () => void;
}

export function ConfirmListDelete(props: ConfirmListDeleteProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "listName",
    "onConfirmDelete",
    "onOutsidePopupClick",
  ]);

  return (
    <ClosableContainer
      class={twMerge(
        "flex flex-col p-2 text-xl bg-white rounded-md mx-4",
        local.class,
      )}
      onClickOutside={local.onOutsidePopupClick}
      onClose={local.onOutsidePopupClick}
      {...rest}
    >
      <div class="flex flex-col gap-6 p-4">
        <p class="text-center">
          Are you sure you want to delete the list: <b>{local.listName}</b> ?
        </p>
        <ColoredButton
          onClick={local.onConfirmDelete}
          class="self-center w-fit bg-red-500 px-4"
        >
          Im sure
        </ColoredButton>
      </div>
    </ClosableContainer>
  );
}
