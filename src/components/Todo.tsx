import { Show, type Component, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { TodoKey, type Todo } from "../types";
import { truncateText } from "../helpers/truncateText";

export interface TodoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  todo: Todo;
  onCheck: (checked: boolean) => void;
}

export const TodoComp: Component<TodoProps> = (props) => {
  const shortenedUUID = truncateText(props.todo.id, 8);

  return (
    <div
      class={twMerge(
        "flex flex-col w-80 py-2 rounded-lg border border-blue-400",
        props.class,
      )}
    >
      <div class="flex justify-between px-2">
        <span class="text-gray-300">ID:{shortenedUUID}</span>
        <span>{props.todo[TodoKey.LIST]}</span>
      </div>
      <div class="flex items-center p-2 border border-red-300">
        <input
          type="checkbox"
          on:change={(e) => props.onCheck(e.target.checked)}
          checked={!!props.todo.completedAt}
        />
        <div class="flex flex-1 items-center border border-purple-300">
          {props.todo.description}
        </div>
      </div>
      <Show when={!!props.todo.dependent || !!props.todo.dependsOn}>
        <div class="flex w-full flex-col bottom-1 left-1 text-gray-300">
          <Show when={props.todo.dependent}>
            <div class="flex w-full justify-between border border-orange-300">
              <span>
                Dependent:{truncateText(props.todo.dependent || "", 8)}
              </span>
            </div>
          </Show>
          <Show when={props.todo.dependsOn}>
            <span>
              Depends On:{truncateText(props.todo.dependsOn || "", 8)}
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
