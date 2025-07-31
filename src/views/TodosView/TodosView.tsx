import { createEffect, createSignal, For, Show } from "solid-js";
import { Transition } from "solid-transition-group";
import type { Todo } from "@/types";
import { useDexieCtx } from "@/context";
import { useAsyncDebounce, useToggle } from "@/hooks";
import { createTodo } from "@/helpers";
import {
  TodoComp,
  ScrollableContainer,
  IconButton,
  OnClickOutsideContainer,
} from "@/components";
import { TodosViewHeader } from "./TodosViewHeader";
import "./todosView.css";
import { db } from "@/db";

export function TodosView() {
  const [
    { chosenListTodos, chosenList },
    { handleTodoCheck, addTodo, deleteTodo, updateTodo },
  ] = useDexieCtx();
  const [showComplete, { toggle }, setShowComplete] = useToggle();
  const [editedTodo, setEditedTodo] = createSignal<Todo>();

  const [transitonName, setTranstionName] = createSignal("slide-fade");

  const [newTodo, setNewTodo] = createSignal<Todo>();

  async function handleClickOutside() {
    const edited = editedTodo();
    if (!edited) return;

    const currentTodo = await db.todos.get(edited.id);
    if (!currentTodo) return;

    if (
      edited.description !== currentTodo.description ||
      edited.dueDate !== currentTodo.dueDate
    ) {
      const updatedTodo: Todo = {
        ...edited,
        updatedAt: Date.now(),
        description: edited.description || "New reminder", // give default,
      };

      updateTodo(updatedTodo).catch((error) => {
        console.error(error);
      });

      setEditedTodo(undefined);
    }
  }

  async function handleCheck(checked: boolean, todo: Todo) {
    return handleTodoCheck(checked, todo).catch((error) =>
      console.error(error),
    );
  }

  // every time a different list is chosen make sure we
  // are not showing the completed todos if they toggled that
  // option on before
  createEffect(() => {
    chosenList();
    setShowComplete(false);
  });

  const debouncedCheck = useAsyncDebounce(handleCheck, 2000);

  const todos = () => {
    const { complete, incomplete } = chosenListTodos();
    if (chosenList()?.name === "completed") {
      return complete;
    }
    if (showComplete()) {
      return [...incomplete, ...complete];
    }
    return incomplete;
  };

  function handleUpdateTodo() {
    const freshTodo = newTodo();
    if (freshTodo) {
      const defaultTodo = createTodo();
      if (
        freshTodo.description !== defaultTodo.description ||
        freshTodo.dueDate !== defaultTodo.dueDate
      ) {
        setTranstionName("add-todo");
        addTodo(freshTodo)
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
        <For each={todos()}>
          {(todo) => (
            <TodoComp
              todo={todo}
              onCheck={(checked) => debouncedCheck(checked, todo)}
              onDelete={() => deleteTodo(todo)}
              onEnter={handleClickOutside}
              onUpdateDescription={(description) => {
                setEditedTodo({
                  ...todo,
                  description,
                });
              }}
              onUpdateDueDate={(dueDate) => {
                setEditedTodo({
                  ...todo,
                  dueDate,
                });
              }}
            />
          )}
        </For>
        <Transition name={transitonName()}>
          <Show when={newTodo()}>
            {(todo) => (
              <OnClickOutsideContainer onClickOutside={handleUpdateTodo}>
                <TodoComp
                  class="border border-red-300"
                  todo={todo()}
                  onCheck={(checked) =>
                    setNewTodo(() => ({
                      ...todo(),
                      completedAt: checked ? Date.now() : undefined,
                    }))
                  }
                  onDelete={() => setNewTodo()}
                  onEnter={handleUpdateTodo}
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
