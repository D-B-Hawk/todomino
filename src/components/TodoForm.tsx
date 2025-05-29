import { For } from "solid-js";
import type { Todo } from "../types";
import type { DOMElement } from "solid-js/jsx-runtime";

interface TodoFormProps {
  newTodo: string;
  dependsOn: Todo["id"] | undefined;
  onNewTodoChange: (val: string) => void;
  onDependsOnChange: (val: string) => void;
  dropDownOptions: Todo[];
  onFormSubmit?: () => void;
}

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
      <select
        on:change={(e) => props.onDependsOnChange(e.target.value)}
        value={props.dependsOn}
      >
        <option value=""></option>
        <For each={props.dropDownOptions}>
          {(todo) => <option value={todo.id}>{todo.description}</option>}
        </For>
      </select>
      <button>submit</button>
    </form>
  );
}
