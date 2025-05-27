import { createEffect, createSignal, For } from "solid-js";
import type { DOMElement } from "solid-js/jsx-runtime";
import { createTodo } from "./helpers/createTodo";
import type { Todo } from "./types";
import { TodoSet, type TodoSetProps } from "./components/TodoSet";
import { noop } from "./helpers/noop";
import { useIdxDB } from "./hooks/useIdxDB";

type FormEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export function App() {
  const [newTodo, setNewTodo] = createSignal("");
  const [dependsOn, setDependsOn] = createSignal<Todo["id"]>();
  const [showDependentsForTodo, setShowDependentsForTodo] = createSignal<
    Record<Todo["id"], boolean>
  >({});

  const [todos, { addItem, updateItem, dbError }] = useIdxDB<Todo>("todos");

  createEffect(() => {
    if (dbError()) {
      console.error(dbError());
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const todo = createTodo({
      description: newTodo(),
      dependsOn: dependsOn(),
    });

    const dependedOn = todos().find((item) => item.id === dependsOn());

    addItem(todo);
    if (dependedOn) {
      const updatedTodo = { ...dependedOn, dependent: todo.id };
      updateItem(updatedTodo);
    }
    setNewTodo("");
    setDependsOn();
  }

  function handleShowDependent(id: Todo["id"]) {
    setShowDependentsForTodo((curShownDependents) => ({
      ...curShownDependents,
      [id]: !curShownDependents[id],
    }));
  }

  const independentTodos = () =>
    todos()
      .filter((i) => !i.dependsOn)
      .sort((a, b) => a.createdAt - b.createdAt);

  const getDependentProps = (id?: Todo["id"]): TodoSetProps | undefined => {
    const dependentTodo = todos().find((i) => i.id === id);

    if (dependentTodo) {
      return {
        todoProps: {
          todo: dependentTodo,
          class: "my-3",
          onShowDependentClick: handleShowDependent,
          onCheck: noop,
        },
        dependentProps: getDependentProps(dependentTodo.dependent),
        showDependent: showDependentsForTodo()[dependentTodo.id],
      };
    }
  };

  const availableOptions = () => todos().filter((i) => !i.dependent);

  return (
    <div class="flex flex-col h-screen max-h-screen border-2 border-purple-500">
      <div class="flex justify-center gap-2 border border-green-400 overflow-scroll">
        <For each={independentTodos()}>
          {(todo) => (
            <div class="border border-red-300 p-2">
              <TodoSet
                todoProps={{
                  todo,
                  class: "my-3",
                  onShowDependentClick: handleShowDependent,
                  onCheck: noop,
                }}
                dependentProps={getDependentProps(todo.dependent)}
                showDependent={showDependentsForTodo()[todo.id]}
              />
            </div>
          )}
        </For>
      </div>
      <form class="flex flex-col gap-3 items-center" on:submit={handleSubmit}>
        <input
          type="text"
          placeholder="New TODO"
          value={newTodo()}
          on:change={(e) => setNewTodo(e.target.value)}
          required
        />
        <select
          on:change={(e) => setDependsOn(e.target.value)}
          value={dependsOn()}
        >
          <option value=""></option>
          <For each={availableOptions()}>
            {(todo) => <option value={todo.id}>{todo.description}</option>}
          </For>
        </select>
        <button>submit</button>
      </form>
    </div>
  );
}
