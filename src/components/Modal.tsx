import { Show, type ParentProps } from "solid-js";
import { Portal } from "solid-js/web";

type ModalProps = ParentProps<{
  showModal: boolean;
}>;

export function Modal(props: ModalProps) {
  return (
    <Show when={props.showModal}>
      <Portal>
        <div class="absolute top-0 left-0 flex items-center justify-center w-screen h-screen bg-black/15">
          {props.children}
        </div>
      </Portal>
    </Show>
  );
}
