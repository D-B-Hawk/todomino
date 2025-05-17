import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

import type { Todo } from "../types";

type TodoArgs = Pick<Todo, "description" | "dependsOn">;

export function createTodo(
  args: TodoArgs = { description: faker.lorem.sentence() }
): Todo {
  return {
    id: uuid(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...args,
  };
}
