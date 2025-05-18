import { Show } from "solid-js";
import { TodoComp, type TodoProps } from "./Todo";

export interface TodoSetProps {
  todoProps: TodoProps;
  showDependent: boolean;
  dependentProps?: TodoSetProps;
}

export function TodoSet(props: TodoSetProps) {
  return (
    <>
      <TodoComp {...props.todoProps} />
      <Show when={props.showDependent}>
        <Show when={props.dependentProps}>
          {(dependent) => <TodoSet {...dependent()} />}
        </Show>
      </Show>
    </>
  );
}
