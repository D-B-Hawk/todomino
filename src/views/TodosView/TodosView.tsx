import { createEffect, createSignal, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import type { Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useToggle } from "@/hooks";
import { createTodo } from "@/helpers";
import {
  TodoComp,
  ScrollableContainer,
  IconButton,
  OnClickOutsideContainer,
} from "@/components";
import { TodosViewHeader } from "./TodosViewHeader";
import "./todosView.css";
import { CurrentTodos } from "./CurrentTodos";

export function TodosView() {
  const [{ chosenListTodos, chosenList }, { addTodo }] = useDexieCtx();

  const [showComplete, { toggle }, setShowComplete] = useToggle();

  const [transitonName, setTranstionName] = createSignal("slide-fade");

  const [newTodo, setNewTodo] = createSignal<Todo>();

  // every time a different list is chosen make sure we
  // are not showing the completed todos if they toggled that
  // option on before
  createEffect(() => {
    chosenList();
    setShowComplete(false);
  });

  function handleCreateTodo() {
    const freshTodo = newTodo();
    if (freshTodo) {
      const defaultTodo = createTodo();
      if (
        freshTodo.description.trim() !== defaultTodo.description ||
        freshTodo.dueDate !== defaultTodo.dueDate
      ) {
        setTranstionName("add-todo");
        addTodo({
          ...freshTodo,
          description: freshTodo.description || "New reminder", // give default
          updatedAt: Date.now(),
        })
          .catch((error) => console.error(error))
          .finally(() => setTranstionName("slide-fade"));
      }
    }
    setNewTodo(undefined);
  }

  return (
    <div class="flex flex-col w-full">
      <Show when={chosenList()}>
        {(list) => (
          <TodosViewHeader
            list={list()}
            completedTodos={chosenListTodos().complete.length}
            onHideShowClick={toggle}
            showComplete={showComplete()}
          />
        )}
      </Show>
      <ScrollableContainer class="relative p-4 gap-2">
        <CurrentTodos showComplete={showComplete()} />
        <Transition name={transitonName()}>
          <Show when={newTodo()}>
            {(todo) => (
              <OnClickOutsideContainer onClickOutside={handleCreateTodo}>
                <TodoComp
                  popUpMenuDisabled
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
                />
              </OnClickOutsideContainer>
            )}
          </Show>
        </Transition>
        <IconButton
          onClick={() => {
            if (newTodo()) {
              return;
            }
            setNewTodo(createTodo());
          }}
          class="flex gap-2 mt-auto"
          iconProps={{ icon: "PLUS_CIRCLE", class: "w-6" }}
        >
          Add Todo
        </IconButton>
      </ScrollableContainer>
    </div>
  );
}
