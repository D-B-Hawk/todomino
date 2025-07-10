import { splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";

type ScrollableContainerProps = JSX.HTMLAttributes<HTMLDivElement>;

export function ScrollableContainer(props: ScrollableContainerProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={twMerge(
        "flex flex-col flex-1 w-full overflow-y-auto",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </div>
  );
}
