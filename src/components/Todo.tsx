import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  Show,
  splitProps,
  type Component,
  type JSX,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { type ListName, type Todo } from "@/types";
import { truncateText } from "@/helpers";
import { Checkbox } from "./Checkbox";
import { PopUpMenu } from "./PopUpMenu";
import { useToggle } from "@/hooks";
import { DatePicker } from "./DatePicker";
import { ListPicker } from "./ListPicker";

export interface TodoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  todo: Todo;
  onCheck: (checked: boolean) => void;
  onDelete: () => void;
  onClickOutside: () => void;
  onUpdateDescription: (value: string) => void;
  onUpdateDueDate: (value: number) => void;
  onUpdateListName: (listName: ListName) => void;
  popUpMenuDisabled?: boolean;
  showListPicker?: boolean;
}

export const TodoComp: Component<TodoProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "class",
    "todo",
    "onCheck",
    "onDelete",
    "onClickOutside",
    "onUpdateDescription",
    "onUpdateDueDate",
    "onUpdateListName",
    "popUpMenuDisabled",
    "showListPicker",
  ]);

  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const [dueDate, setDueDate] = createSignal(local.todo.dueDate);
  const [listName, setListName] = createSignal(local.todo.list);

  const [showPickerMenus, { toggle }, setShowPickerMenus] = useToggle();

  function handleOutside(event: MouseEvent) {
    if (
      event.target instanceof Node &&
      containerRef()?.contains(event.target)
    ) {
      return;
    }
    toggle();
    local.onClickOutside();
  }

  createEffect(
    on(
      showPickerMenus,
      (picker) => {
        if (picker) {
          document.addEventListener("click", handleOutside);
          return;
        }
        document.removeEventListener("click", handleOutside);
      },
      { defer: true },
    ),
  );

  onCleanup(() => document.removeEventListener("click", handleOutside));

  const shortenedUUID = truncateText(local.todo.id, 8);

  return (
    <div
      class={twMerge(
        "flex w-full flex-col py-2 rounded-lg border border-blue-400",
        local.class,
      )}
      ref={setContainerRef}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          local.onClickOutside();
          toggle();
        }
      }}
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
            value={local.todo.description}
            placeholder="New Reminder"
            onFocus={() => setShowPickerMenus(true)}
            onInput={(e) => local.onUpdateDescription(e.target.value)}
          />
          <Show when={showPickerMenus()}>
            <div class="flex gap-2 border border-blue-400">
              <DatePicker
                currentDate={dueDate()}
                onDateChange={(dueDate) => {
                  setDueDate(dueDate);
                  local.onUpdateDueDate(dueDate);
                }}
              />
              <Show when={local.showListPicker}>
                <ListPicker
                  todoListName={listName()}
                  onListOptionClick={(listName) => {
                    setListName(listName);
                    local.onUpdateListName(listName);
                  }}
                />
              </Show>
            </div>
          </Show>
        </div>
        <PopUpMenu
          disabled={local.popUpMenuDisabled}
          clickOutsideContainerClass="top-1/2 right-6.5 -translate-y-1/2"
        >
          <menu>
            <li>
              <button
                class="p-2 rounded-md bg-red-500 text-white cursor-pointer"
                onClick={local.onDelete}
              >
                Delete
              </button>
            </li>
          </menu>
        </PopUpMenu>
      </div>
    </div>
  );
};
