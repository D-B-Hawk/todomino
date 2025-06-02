import { createEffect, createSignal, For } from "solid-js";
import { createTodo } from "./helpers/createTodo";
import type { Todo } from "./types";
import { TodoSet, type TodoSetProps } from "./components/TodoSet";
import { useIdxDB } from "./hooks/useIdxDB";
import { TodoForm } from "./components/TodoForm";

export function App() {
  const [newTodo, setNewTodo] = createSignal("");
  const [dependsOn, setDependsOn] = createSignal<Todo["id"]>();
  const [showCompleted, setShowCompleted] = createSignal(true);
  const [showDependentsForTodo, setShowDependentsForTodo] = createSignal<
    Record<Todo["id"], boolean>
  >({});

  const [todos, { addItem, updateItem, dbError, reqError }] =
    useIdxDB<Todo>("todos");

  const displayedTodos = () =>
    todos().filter((todo) => !!todo.completedAt === showCompleted());

  createEffect(() => {
    if (dbError()) {
      console.error(dbError());
    }
  });

  createEffect(() => {
    if (reqError()) {
      console.error(reqError());
    }
  });

  function handleSubmit() {
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

  function handleCheck(checked: boolean, todo: Todo) {
    const now = Date.now();
    const completedAt = checked ? now : undefined;
    const dependentTodo = todos().find((item) => item.id === todo.dependent);

    const completedTodo = {
      ...todo,
      updatedAt: now,
      completedAt,
      dependent: undefined,
    };

    updateItem(completedTodo);

    if (dependentTodo) {
      const updatedDependent = {
        ...dependentTodo,
        updatedAt: now,
        dependsOn: undefined,
      };

      updateItem(updatedDependent);
    }
  }

  const independentTodos = () =>
    displayedTodos()
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
          onCheck: (checked) => handleCheck(checked, dependentTodo),
        },
        dependentProps: getDependentProps(dependentTodo.dependent),
        showDependent: showDependentsForTodo()[dependentTodo.id],
      };
    }
  };

  const availableOptions = () => displayedTodos().filter((i) => !i.dependent);

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
                  onCheck: (checked) => handleCheck(checked, todo),
                }}
                dependentProps={getDependentProps(todo.dependent)}
                showDependent={showDependentsForTodo()[todo.id]}
              />
            </div>
          )}
        </For>
      </div>
      <TodoForm
        newTodo={newTodo()}
        dependsOn={dependsOn()}
        onNewTodoChange={setNewTodo}
        onDependsOnChange={setDependsOn}
        dropDownOptions={availableOptions()}
        onFormSubmit={handleSubmit}
      />
      <button
        class="py-1 px-2 border rounded-md w-fit self-center "
        onClick={() => setShowCompleted((complete) => !complete)}
      >
        {showCompleted() ? "Hide" : "Show"}
      </button>
    </div>
  );
}
