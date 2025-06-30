import { createSignal, For, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { z } from "zod/v4";
import { TextField } from "./TextField";
import { AppIconKey, ICON_KEYS, IconKey } from "../constants";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import { useDexie, useOnClickOutside } from "../hooks";
import type { FormSubmitEvent } from "../types";
import { getFormData } from "../helpers/getFormData";
import { ColorPicker, PickerColor } from "./ColorPicker";

interface AddListFormProps
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
  const [iconKey, setIconKey] = createSignal<IconKey>(IconKey.BOX);
  const [iconColor, setIconColor] = createSignal<PickerColor>(PickerColor.BLUE);

  let formRef: HTMLFormElement | undefined;

  useOnClickOutside(() => formRef, local.onOutsideFormClick);

  const [{ lists }, { addList }] = useDexie();

  const LIST_FORM_SCHEMA = z.object({
    name: z
      .string()
      .trim()
      .refine((val) => !lists().find((list) => list.name === val), {
        error: "list name is taken",
      }),
    icon: z.enum(IconKey),
    color: z.enum(PickerColor),
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
      <button
        class="absolute w-10 h-10 top-2 right-2 rounded-full"
        type="button"
        onClick={local.onCloseForm}
      >
        <Icon
          icon={AppIconKey.PLUS_CIRCLE}
          class="rotate-45 rounded-full w-full h-full stroke-[1.5] stroke-slate-400"
        />
      </button>
      <div
        class="border p-2 h-fit w-fit rounded-full self-center"
        style={{ "background-color": iconColor() }}
      >
        <Icon icon={iconKey()} />
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
          <For each={ICON_KEYS}>
            {(key) => (
              <IconButton
                onClick={() => setIconKey(key)}
                style={{ "background-color": iconColor() }}
                iconProps={{ icon: key }}
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
