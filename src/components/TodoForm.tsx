import type { DOMElement } from "solid-js/jsx-runtime";
import { SelectInput, type Option, type SelectInputProps } from "./SelectInput";

type TodoFormProps = {
  newTodo: string;
  onNewTodoChange: (val: string) => void;
  onDependsOnChange: (val: string) => void;
  onFormSubmit?: () => void;
} & SelectInputProps<Option>;

type FormEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export function TodoForm(props: TodoFormProps) {
  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    props.onFormSubmit?.();
  }

  return (
    <form class="flex flex-col gap-3 items-center" on:submit={handleFormSubmit}>
      <input
        type="text"
        placeholder="New TODO"
        value={props.newTodo}
        on:change={(e) => props.onNewTodoChange(e.target.value)}
        required
      />
      <SelectInput
        selectValue={props.selectValue}
        selectOptions={props.selectOptions}
      />
      <button>submit</button>
    </form>
  );
}
