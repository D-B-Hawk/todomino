import type { DOMElement } from "solid-js/jsx-runtime";
import { TodoComp } from "./components/Todo";
import { createFakeTodos } from "./helpers/createFakeTodos";
import { createSignal, For } from "solid-js";
import { createTodo } from "./helpers/createTodo";

type FormEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export function App() {
  const [currentTodos, setCurrentTodos] = createSignal(createFakeTodos(3));
  const [newTodo, setNewTodo] = createSignal("");
  const [dependsOn, setDependsOn] = createSignal<string>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const todo = createTodo({
      description: newTodo(),
      dependsOn: dependsOn(),
    });
    setNewTodo("");
    setDependsOn();
    setCurrentTodos((curTodos) => [...curTodos, todo]);
  }

  return (
    <div class="flex flex-col items-center">
      <For each={currentTodos()}>
        {(todo) => (
          <TodoComp
            class="my-3"
            todo={todo}
            onCheck={(checked) =>
              console.log("the input has been checked =>", checked)
            }
          />
        )}
      </For>
      <form
        class="flex flex-col gap-3 items-center border border-red-500"
        on:submit={handleSubmit}
      >
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
          <For each={currentTodos()}>
            {(todo) => <option value={todo.id}>{todo.description}</option>}
          </For>
        </select>
        <button>submit</button>
      </form>
    </div>
  );
}
