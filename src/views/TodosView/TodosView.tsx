import { createEffect, createSignal, on, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import type { ListName, Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useToggle } from "@/hooks";
import {
  createTodo,
  getCurrentTime,
  hasTodominoIndex,
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
  const [
    { lists, chosenList, chosenListCompleteTodos, listsIncompleteTodosCount },
    { addTodo },
  ] = useDexieCtx();

  const [showCompletedTodos, { toggle }, setShowCompletedTodos] = useToggle();

  const [transitonName, setTranstionName] = createSignal("slide-fade");

  const [newTodo, setNewTodo] = createSignal<Todo>();

  // every time a different list is chosen make sure we
  // are only showing incomplete todos by default
  createEffect(
    on(
      chosenList,
      (list, prevList) => {
        if (prevList && list !== prevList && showCompletedTodos()) {
          setShowCompletedTodos(false);
        }
      },
      { defer: true },
    ),
  );

  // if there are completed todos that are checked off as incomplete
  // make sure the setShowCompleted is turned off. If left turned on the
  // behavior is to make the newly checked off todos update immediately.
  // instead of the default behavior of delaying the update for 2 seconds
  // in case they change their mind, made a mistake, checking off multiple, etc.
  /**
   * See {@link CurrentTodos} => handleCheck
   */

  createEffect(
    on(
      chosenListCompleteTodos,
      (completeTodos, prevCompleteTodos) => {
        if (prevCompleteTodos && !completeTodos.length) {
          setShowCompletedTodos(false);
        }
      },
      { defer: true },
    ),
  );

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

  function handleUpdateTodomino() {
    const freshTodo = newTodo();
    if (freshTodo) {
      let nextDominoIndex: Todo["dominoIndex"] =
        listsIncompleteTodosCount()["todomino"];

      if (hasTodominoIndex(freshTodo)) {
        nextDominoIndex = undefined;
      }

      setNewTodo({ ...freshTodo, dominoIndex: nextDominoIndex });
    }
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
                    setNewTodo({ ...todo(), description })
                  }
                  onUpdateDueDate={(dueDate) =>
                    setNewTodo({ ...todo(), dueDate })
                  }
                  onUpdateListName={(list) => setNewTodo({ ...todo(), list })}
                  onUpdateTodomino={handleUpdateTodomino}
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
