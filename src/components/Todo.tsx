import { Show, splitProps, type Component, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { type Todo } from "@/types";
import { truncateText } from "@/helpers";
import { Checkbox } from "./Checkbox";
import { PopUpMenu } from "./PopUpMenu";

export interface TodoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  todo: Todo;
  onCheck: (checked: boolean) => void;
  onDelete: () => void;
}

export const TodoComp: Component<TodoProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "class",
    "todo",
    "onCheck",
    "onDelete",
  ]);

  const shortenedUUID = truncateText(props.todo.id, 8);

  return (
    <div
      class={twMerge(
        "flex flex-col w-80 py-2 rounded-lg border border-blue-400",
        local.class,
      )}
      {...rest}
    >
      <div class="flex justify-between px-2">
        <span class="text-gray-300">ID:{shortenedUUID}</span>
        <span>{local.todo.list}</span>
      </div>
      <div class="relative flex items-center p-2 gap-1 border border-red-300">
        <Checkbox
          onCheck={(e) => local.onCheck(e.target.checked)}
          checked={!!local.todo.completedAt}
        />
        <div class="flex flex-1 items-center border border-purple-300">
          {local.todo.description}
        </div>
        <PopUpMenu>
          <menu>
            <li>
              <button
                class="border p-2 bg-red-500 text-white cursor-pointer"
                onClick={local.onDelete}
              >
                Delete Todo
              </button>
            </li>
          </menu>
        </PopUpMenu>
      </div>
      <Show when={!!local.todo.dependent || !!local.todo.dependsOn}>
        <div class="flex w-full flex-col bottom-1 left-1 text-gray-300">
          <Show when={local.todo.dependsOn}>
            <span>
              Depends On:{truncateText(local.todo.dependsOn || "", 8)}
            </span>
          </Show>
          <Show when={local.todo.dependent}>
            <div class="flex w-full justify-between border border-orange-300">
              <span>
                Dependent:{truncateText(local.todo.dependent || "", 8)}
              </span>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};
