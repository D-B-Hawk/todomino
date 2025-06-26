import { createSignal, For, splitProps, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { TextField } from "./TextField";
import { AppIconKey, ICON_KEYS, IconKey } from "../constants";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";
import { useOnClickOutside } from "../hooks";

interface AddListFormProps extends JSX.HTMLAttributes<HTMLFormElement> {
  onCloseForm: () => void;
  onOutsideFormClick: () => void;
}

export function AddListForm(props: AddListFormProps) {
  const [local, formProps] = splitProps(props, [
    "class",
    "onCloseForm",
    "onOutsideFormClick",
  ]);
  const [iconKey, setIconKey] = createSignal<IconKey>(IconKey.BOX);

  let formRef: HTMLFormElement | undefined;

  useOnClickOutside(() => formRef, local.onOutsideFormClick);

  return (
    <form
      class={twMerge(
        "relative flex flex-col p-6 bg-white rounded-md gap-4",
        local.class,
      )}
      ref={formRef}
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
      <div class="border p-2 h-fit w-fit rounded-full self-center bg-red-500">
        <Icon icon={iconKey()} />
      </div>
      <label class="flex gap-2 items-center">
        Name:
        <TextField name="name" required />
      </label>
      <input type="text" value={iconKey()} hidden name="icon" />
      <div class="flex flex-col items-center gap-4">
        <h3 class="self-center font-semibold">Icon</h3>
        <div class="flex flex-wrap items-center justify-center gap-2 max-w-64">
          <For each={ICON_KEYS}>
            {(key) => (
              <IconButton
                onClick={() => setIconKey(key)}
                classList={{
                  "bg-red-500": key === iconKey(),
                }}
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
