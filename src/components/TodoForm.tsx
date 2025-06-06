import { splitProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { SelectInput, type SelectInputProps } from "./SelectInput";
import { twMerge } from "tailwind-merge";

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
    <form
      class={twMerge("flex flex-col gap-3 items-center", local.class)}
      {...formProps}
    >
      <input type="text" name="description" placeholder="New TODO" required />
      <SelectInput {...local.listSelectProps} />
      <SelectInput {...local.dependentSelectProps} />
      <button>submit</button>
    </form>
  );
}
