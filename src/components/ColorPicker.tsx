import { For, Show, splitProps, type JSX } from "solid-js";
import type { PickerColor } from "@/types";
import { COLOR_PICKER_KEYS, PICKER_COLORS } from "@/constants/colors";

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
      <For each={COLOR_PICKER_KEYS}>
        {(colorKey) => (
          <button
            class="rounded-full"
            onClick={() => local.onColorPicked(colorKey)}
            type="button"
          >
            <div
              class="flex justify-center items-center h-4 w-4 rounded-full"
              style={{ "background-color": PICKER_COLORS[colorKey] }}
            >
              <Show when={local.selectedColor === colorKey}>
                <div class="h-2 w-2 bg-white rounded-full" />
              </Show>
            </div>
          </button>
        )}
      </For>
    </div>
  );
}
