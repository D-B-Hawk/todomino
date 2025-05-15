import { TodoComp } from "./components/Todo";
import { v4 as uuidv4 } from "uuid";

import type { Todo } from "./types";

const TODO: Todo = {
  id: uuidv4(),
  description: "Create TODO app",
  createdAt: 1234,
  updatedAt: 1234,
};

export function App() {
  return (
    <div class="flex flex-col items-center border border-red-500">
      <TodoComp
        class="my-3"
        todo={TODO}
        onCheck={(checked) =>
          console.log("the input has been checked =>", checked)
        }
      />
    </div>
  );
}
