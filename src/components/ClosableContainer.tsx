import { splitProps } from "solid-js";
import { IconButton } from "./IconButton";
import {
  OnClickOutsideContainer,
  type OnClickOutsideContainerProps,
} from "./OnClickOutsideContainer";

interface ClosableContainerProps extends OnClickOutsideContainerProps {
  onClose: () => void;
}

export function ClosableContainer(props: ClosableContainerProps) {
  const [local, rest] = splitProps(props, ["children", "onClose"]);
  return (
    <OnClickOutsideContainer {...rest}>
      <div class="flex justify-end">
        <IconButton
          onClick={local.onClose}
          iconProps={{
            icon: "PLUS_CIRCLE",
            class: "w-6 rotate-45 stroke-slate-400",
          }}
        />
      </div>
      {local.children}
    </OnClickOutsideContainer>
  );
}
