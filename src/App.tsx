import { TodoComp } from "./components/Todo";
import { createFakeTodos } from "./helpers/createFakeTodos";
import { For } from "solid-js";

const FAKE_TODOS = createFakeTodos(3);

export function App() {
  return (
    <div class="flex flex-col items-center border border-red-500">
      <For each={FAKE_TODOS}>
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
    </div>
  );
}
