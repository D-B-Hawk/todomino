import { splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { SelectInput, type SelectInputProps } from "./SelectInput";
import { TextField } from "./TextField";

interface TodoFormProps extends JSX.HTMLAttributes<HTMLFormElement> {
  listSelectProps: SelectInputProps;
  dependentSelectProps: SelectInputProps;
  class?: string;
}

export function TodoForm(props: TodoFormProps) {
  const [local, formProps] = splitProps(props, [
    "listSelectProps",
    "dependentSelectProps",
    "class",
  ]);

  return (
    <form class={twMerge("flex flex-col gap-3", local.class)} {...formProps}>
      <TextField
        name="description"
        labelProps={{ label: "Description" }}
        placeholder="New TODO"
        required
      />
      <SelectInput labelProps={{ label: "List:" }} {...local.listSelectProps} />
      <SelectInput
        labelProps={{ label: "Dependent:" }}
        {...local.dependentSelectProps}
      />
      <button class="bg-blue-400 rounded-md text-white p-2 px-4 w-fit self-center cursor-pointer">
        submit
      </button>
    </form>
  );
}
