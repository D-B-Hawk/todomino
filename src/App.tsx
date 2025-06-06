import { createEffect, createSignal, For } from "solid-js";
import { createTodo } from "./helpers/createTodo";
import { type FormSubmitEvent, type Todo } from "./types";
import { TodoSet, type TodoSetProps } from "./components/TodoSet";
import { useDexie } from "./hooks/useDexie";
import { TodoForm } from "./components/TodoForm";
import { TODO_FORM_SCHEMA } from "./constants";

export function App() {
  const [showCompleted, setShowCompleted] = createSignal(true);
  const [showDependentsForTodo, setShowDependentsForTodo] = createSignal<
    Record<Todo["id"], boolean>
  >({});

  const [lists, todos, { addTodo, error, handleTodoCheck }] = useDexie();

  const displayedTodos = () =>
    todos().filter(
      (todo) =>
        !!todo.completedAt === false || !!todo.completedAt === showCompleted(),
    );

  createEffect(() => {
    if (error()) {
      console.error("an error", error());
    }
  });

  function handleShowDependent(id: Todo["id"]) {
    setShowDependentsForTodo((curShownDependents) => ({
      ...curShownDependents,
      [id]: !curShownDependents[id],
    }));
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
          onCheck: (checked) => handleTodoCheck(checked, dependentTodo),
        },
        dependentProps: getDependentProps(dependentTodo.dependent),
        showDependent: showDependentsForTodo()[dependentTodo.id],
      };
    }
  };

  function handleFormSubmit(event: FormSubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const res = TODO_FORM_SCHEMA.safeParse(data);
    if (!res.success) {
      console.error(res.error);
      return;
    }

    const todo = createTodo(res.data);

    addTodo(todo)
      .then(() => form.reset())
      .catch((error) => console.error("error adding todo =>", error));
  }

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
                  onCheck: (checked) => handleTodoCheck(checked, todo),
                }}
                dependentProps={getDependentProps(todo.dependent)}
                showDependent={showDependentsForTodo()[todo.id]}
              />
            </div>
          )}
        </For>
      </div>

      <TodoForm
        onSubmit={handleFormSubmit}
        dependentSelectProps={{
          name: "dependsOn",
          options: availableOptions().map((option) => ({
            id: option.id,
            value: option.description,
          })),
        }}
        listSelectProps={{
          name: "list",
          options: lists().map((item) => ({
            id: item,
            value: item,
          })),
        }}
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
