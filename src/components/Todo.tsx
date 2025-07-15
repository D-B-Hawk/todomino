import {
  createEffect,
  createSignal,
  Show,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { type Todo } from "@/types";
import { truncateText } from "@/helpers";
import { Checkbox } from "./Checkbox";
import { PopUpMenu } from "./PopUpMenu";
import { useToggle } from "@/hooks";
import { useDexieCtx } from "@/context";
import { DatePickerButton } from "./DatePickerButton";

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

  const [, { updateTodo }] = useDexieCtx();

  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const [updatedDescription, setUpdatedDescription] = createSignal(
    local.todo.description,
  );
  const [updatedDueDate, setUpdatedDueDate] = createSignal(local.todo.dueDate);

  const [showInput, { toggle }, setShowInput] = useToggle();

  function handleClickOutside() {
    if (
      updatedDescription() !== local.todo.description ||
      updatedDueDate() !== local.todo.dueDate
    ) {
      const updatedTodo: Todo = {
        ...local.todo,
        updatedAt: Date.now(),
        description: updatedDescription() || "New reminder", // give default,
        dueDate: updatedDueDate(),
      };

      updateTodo(updatedTodo).catch((error) => {
        console.error(error);
      });
    }
    toggle();
  }

  function handleOutside(event: MouseEvent) {
    if (
      event.target instanceof Node &&
      containerRef()?.contains(event.target)
    ) {
      return;
    }
    handleClickOutside();
  }

  createEffect(() => {
    if (showInput()) {
      document.addEventListener("mousedown", handleOutside);
      return () => {
        document.removeEventListener("mousedown", handleOutside);
      };
    }
    document.removeEventListener("mousedown", handleOutside);
  });

  const shortenedUUID = truncateText(local.todo.id, 8);

  return (
    <div
      class={twMerge(
        "flex flex-col w-80 py-2 rounded-lg border border-blue-400",
        local.class,
      )}
      ref={setContainerRef}
      {...rest}
    >
      <div class="flex justify-between px-2">
        <span class="text-gray-300">ID:{shortenedUUID}</span>
        <span>{local.todo.list}</span>
      </div>
      <div class="relative flex p-2 gap-1 border border-red-300">
        <Checkbox
          class="mt-1"
          onCheck={(e) => local.onCheck(e.target.checked)}
          checked={!!local.todo.completedAt}
        />
        <div class="flex flex-col flex-1 gap-2 border border-red-300 justify-between">
          <input
            type="text"
            value={updatedDescription()}
            onFocus={() => setShowInput(true)}
            onInput={(e) => setUpdatedDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleClickOutside();
              }
            }}
          />
          <Show when={showInput()}>
            <DatePickerButton
              currentDate={updatedDueDate()}
              onDateChange={setUpdatedDueDate}
            />
          </Show>
        </div>
        <PopUpMenu class="mt-1">
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
