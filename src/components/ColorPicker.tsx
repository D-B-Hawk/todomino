import { For, Show, splitProps, type JSX } from "solid-js";

export enum PickerColor {
  RED = "#fc3a2f",
  ORANGE = "#fd9500",
  YELLOW = "#fecb00",
  GREEN = "#17c658",
  BLUE = "#0078fe",
  LIGHT_BLUE = "#50a9f0",
  IRIS = "#5754d5",
  LIPSTICK_PINK = "#e93f69",
  PURPLE = "#be77da",
  BROWN = "#9c8462",
  SLATE_GREY = "#5a666e",
  SALMON = "#d8a49e",
}

interface ColorPickerProps extends JSX.HTMLAttributes<HTMLDivElement> {
  selectedColor: PickerColor;
  onColorPicked: (color: PickerColor) => void;
}

export function ColorPicker(props: ColorPickerProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "onColorPicked",
    "selectedColor",
  ]);
  return (
    <div class="flex flex-wrap gap-2" {...rest}>
      <For each={Object.values(PickerColor)}>
        {(color) => (
          <button
            class="rounded-full"
            onClick={() => local.onColorPicked(color)}
            type="button"
          >
            <div
              class="flex justify-center items-center h-4 w-4 rounded-full"
              style={{ "background-color": color }}
            >
              <Show when={local.selectedColor === color}>
                <div class="h-2 w-2 bg-white rounded-full" />
              </Show>
            </div>
          </button>
        )}
      </For>
    </div>
  );
}
