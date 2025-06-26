import { For, Show } from "solid-js";
import { TodoComp } from "../components/Todo";
import type { FormSubmitEvent, ListName, Todo } from "../types";
import { TodoForm } from "../components/TodoForm";
import type { Option } from "../components/SelectInput";

type TodosViewProps = {
  todos: Todo[];
  selectedListName: ListName | undefined;
  availableDependentOptions: Option[];
  listSelectOptions: Option[];
  onTodoFormSubmit: (event: FormSubmitEvent) => void;
  onTodoCheck: (checked: boolean, todo: Todo) => void;
};

export function TodosView(props: TodosViewProps) {
  return (
    <div class="flex flex-col gap-2 border border-green-400">
      <For each={props.todos}>
        {(todo) => (
          <TodoComp
            todo={todo}
            onCheck={(checked) => props.onTodoCheck(checked, todo)}
          />
        )}
      </For>
      {/* todo form */}
      <Show when={props.selectedListName !== "completed"}>
        <div class="flex border-2 border-lime-200">
          <TodoForm
            onSubmit={props.onTodoFormSubmit}
            listSelectProps={{
              name: "list",
              options: props.listSelectOptions,
            }}
            dependentSelectProps={{
              name: "dependsOn",
              options: props.availableDependentOptions,
              withBlankOption: true,
            }}
          />
        </div>
      </Show>
    </div>
  );
}
