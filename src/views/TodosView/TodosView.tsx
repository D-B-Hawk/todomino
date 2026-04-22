import { createEffect, createSignal, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import type { ListName, Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useToggle } from "@/hooks";
import {
  createTodo,
  getCurrentTime,
  isEqualExcludingKeys,
  isReadOnlyListName,
} from "@/helpers";
import {
  TodoComp,
  ScrollableContainer,
  IconButton,
  OnClickOutsideContainer,
} from "@/components";
import { TodosViewHeader } from "./TodosViewHeader";
import "./todosView.css";
import { CurrentTodos } from "./CurrentTodos";
import { INITIAL_LIST_NAMES } from "@/constants/lists";

export function TodosView() {
  const [{ lists, chosenList }, { addTodo }] = useDexieCtx();

  const [showCompletedTodos, { toggle }, setShowCompletedTodos] = useToggle();

  const [transitonName, setTranstionName] = createSignal("slide-fade");

  const [newTodo, setNewTodo] = createSignal<Todo>();

  // every time a different list is chosen make sure we
  // are not showing the completed todos if they toggled that
  // option on before
  createEffect(() => {
    chosenList();
    setShowCompletedTodos(false);
  });

  function handleCreateTodo() {
    const freshTodo = newTodo();
    if (!freshTodo) return;

    const defaultTodo = createTodo({
      list: getListname(),
      dueDate: getTime(),
    });

    if (
      !isEqualExcludingKeys(freshTodo, defaultTodo, [
        "id",
        "createdAt",
        "updatedAt",
      ])
    ) {
      setTranstionName("add-todo");
      addTodo({
        ...freshTodo,
        description: freshTodo.description || "New reminder", // give default
      })
        .catch((error) => console.error(error))
        .finally(() => setTranstionName("slide-fade"));
    }

    setNewTodo(undefined);
  }

  function handleClick() {
    if (newTodo()) {
      return;
    }
    setNewTodo(createTodo({ list: getListname(), dueDate: getTime() }));
  }

  const showAddList = () => chosenList()?.name !== "completed";

  const showListPicker = () => lists().length > INITIAL_LIST_NAMES.length;

  function getListname(): ListName {
    const chosenListName = chosenList()?.name;
    if (!chosenListName || isReadOnlyListName(chosenListName)) {
      return "reminders";
    }
    return chosenListName;
  }

  function getTime() {
    const chosenListName = chosenList()?.name;
    if (chosenListName === "today") {
      const [todaysDate] = getCurrentTime();
      todaysDate.setSeconds(0, 0); // standardize seconds
      return todaysDate.valueOf();
    }
    return undefined;
  }

  return (
    <div class="flex flex-col w-full">
      <Show when={chosenList()}>
        <TodosViewHeader
          onHideShowClick={toggle}
          showCompletedTodos={showCompletedTodos()}
        />
      </Show>
      <ScrollableContainer class="relative p-4 gap-2">
        <CurrentTodos showCompletedTodos={showCompletedTodos()} />
        <Transition name={transitonName()}>
          <Show when={newTodo()}>
            {(todo) => (
              <OnClickOutsideContainer onClickOutside={handleCreateTodo}>
                <TodoComp
                  popUpMenuDisabled
                  showListPicker={showListPicker()}
                  onClickOutside={handleCreateTodo}
                  todo={todo()}
                  onCheck={(checked) =>
                    setNewTodo(() => ({
                      ...todo(),
                      completedAt: checked ? Date.now() : undefined,
                    }))
                  }
                  onDelete={() => setNewTodo()}
                  onUpdateDescription={(description) =>
                    setNewTodo(() => ({ ...todo(), description }))
                  }
                  onUpdateDueDate={(dueDate) =>
                    setNewTodo(() => ({ ...todo(), dueDate }))
                  }
                  onUpdateListName={(list) =>
                    setNewTodo(() => ({ ...todo(), list }))
                  }
                />
              </OnClickOutsideContainer>
            )}
          </Show>
        </Transition>
        <Show when={showAddList()}>
          <IconButton
            onClick={handleClick}
            class="gap-2 mt-auto"
            iconProps={{ icon: "PLUS_CIRCLE", class: "w-6" }}
          >
            Add Todo
          </IconButton>
        </Show>
      </ScrollableContainer>
    </div>
  );
}
