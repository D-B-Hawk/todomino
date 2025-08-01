import { createSignal, For, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { z } from "zod/v4";
import { TextField } from "./TextField";
import { COLOR_PICKER_KEYS, PICKER_COLORS } from "@/constants/colors";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import { useOnClickOutside } from "@/hooks";
import type { FormSubmitEvent, IconKey, PickerColor } from "@/types";
import { getFormData } from "@/helpers/getFormData";
import { ColorPicker } from "./ColorPicker";
import { useDexieCtx } from "@/context";
import { APP_ICON_KEYS } from "@/constants/icons";

export interface AddListFormProps
  extends Omit<
    JSX.HTMLAttributes<HTMLFormElement>,
    "onSubmit" | "on:submit" | "onsubmit"
  > {
  onCloseForm: () => void;
  onOutsideFormClick: () => void;
  onFormSubmitSuccess: () => void;
}

export function AddListForm(props: AddListFormProps) {
  const [local, formProps] = splitProps(props, [
    "class",
    "onCloseForm",
    "onOutsideFormClick",
    "onFormSubmitSuccess",
  ]);
  const [iconKey, setIconKey] = createSignal<IconKey>("BOX");
  const [iconColor, setIconColor] = createSignal<PickerColor>("BLUE");

  let formRef: HTMLFormElement | undefined;

  useOnClickOutside(() => formRef, local.onOutsideFormClick);

  const [{ lists }, { addList }] = useDexieCtx();

  const LIST_FORM_SCHEMA = z.object({
    name: z
      .string()
      .trim()
      .refine((val) => !lists().find((list) => list.name === val), {
        error: "list name is taken",
      }),
    icon: z.enum(APP_ICON_KEYS),
    color: z.enum(COLOR_PICKER_KEYS),
  });

  function handleListFormSubmit(event: FormSubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = getFormData(form);

    const parsed = LIST_FORM_SCHEMA.safeParse(data);
    if (parsed.error) {
      console.error(parsed.error);
      return;
    }

    addList(parsed.data)
      .then(() => {
        form.reset();
        local.onFormSubmitSuccess();
      })
      .catch((error) => console.error(error));
  }

  return (
    <form
      class={twMerge(
        "relative flex flex-col p-6 bg-white rounded-md gap-4",
        local.class,
      )}
      ref={formRef}
      onSubmit={handleListFormSubmit}
      {...formProps}
    >
      <IconButton
        onClick={local.onCloseForm}
        class="absolute w-10 h-10 top-2 right-2 rounded-full"
        iconProps={{
          icon: "PLUS_CIRCLE",
          class:
            "rotate-45 rounded-full w-full h-full stroke-[1.5] stroke-slate-400",
        }}
      />
      <div
        class="border p-2 h-fit w-fit rounded-full self-center"
        style={{ "background-color": PICKER_COLORS[iconColor()] }}
      >
        <Icon icon={iconKey()} class="stroke-white w-6" />
      </div>
      <label class="flex gap-2 items-center">
        Name:
        <TextField name="name" required maxLength={18} />
      </label>
      <input type="text" value={iconColor()} hidden name="color" />
      <div class="flex flex-col items-center w-[200px] self-center gap-4">
        <h2 class="font-semibold">Color</h2>
        <ColorPicker selectedColor={iconColor()} onColorPicked={setIconColor} />
      </div>
      <input type="text" value={iconKey()} hidden name="icon" />
      <div class="flex flex-col items-center gap-4">
        <h3 class="self-center font-semibold">Icon</h3>
        <div class="flex flex-wrap items-center justify-center gap-2 max-w-64">
          <For each={APP_ICON_KEYS}>
            {(key) => (
              <IconButton
                onClick={() => setIconKey(key)}
                style={{ "background-color": PICKER_COLORS[iconColor()] }}
                class="p-2"
                iconProps={{ icon: key, stroke: "white", class: "w-6" }}
              />
            )}
          </For>
        </div>
      </div>
      <button class="bg-blue-200 rounded-md p-2 font-semibold">
        Create list
      </button>
    </form>
  );
}
