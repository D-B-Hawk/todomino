import type { DOMElement } from "solid-js/jsx-runtime";
import { createFakeTodos } from "./helpers/createFakeTodos";
import { createSignal, For } from "solid-js";
import { createTodo } from "./helpers/createTodo";
import type { Todo } from "./types";
import { TodoSet, type TodoSetProps } from "./components/TodoSet";

type FormEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export function App() {
  const [currentTodos, setCurrentTodos] = createSignal(createFakeTodos(1));
  const [newTodo, setNewTodo] = createSignal("");
  const [dependsOn, setDependsOn] = createSignal<Todo["id"]>();
  const [showDependentsForTodo, setShowDependentsForTodo] = createSignal<
    Record<Todo["id"], boolean>
  >({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const todo = createTodo({
      description: newTodo(),
      dependsOn: dependsOn(),
    });

    const dependedOn = currentTodos().find((item) => item.id === dependsOn());

    if (dependedOn) {
      const updatedMain = { ...dependedOn, dependent: todo.id };

      setCurrentTodos((curTodos) => [
        ...curTodos.filter((item) => item.id !== dependedOn.id),
        updatedMain,
        todo,
      ]);
    } else {
      setCurrentTodos((todos) => [...todos, todo]);
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

  const mainTodos = () =>
    currentTodos()
      .filter((i) => !i.dependsOn)
      .sort((a, b) => a.createdAt - b.createdAt);

  const getDependentProps = (id?: Todo["id"]): TodoSetProps | undefined => {
    const dependentTodo = currentTodos().find((i) => i.id === id);

    if (dependentTodo) {
      return {
        todoProps: {
          todo: dependentTodo,
          class: "my-3",
          onShowDependentClick: handleShowDependent,
          onCheck: (checked) =>
            console.log("the input has been checked =>", checked),
        },
        dependentProps: getDependentProps(dependentTodo.dependent),
        showDependent: showDependentsForTodo()[dependentTodo.id],
      };
    }
  };

  const availableOptions = () => currentTodos().filter((i) => !i.dependent);

  return (
    <div class="flex flex-col h-screen max-h-screen border-2 border-purple-500">
      <div class="flex justify-center gap-2 border border-green-400">
        <For each={mainTodos()}>
          {(todo) => (
            <div class="border border-red-300 p-2">
              <TodoSet
                todoProps={{
                  todo,
                  class: "my-3",
                  onShowDependentClick: handleShowDependent,
                  onCheck: (checked) =>
                    console.log("the input has been checked =>", checked),
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
