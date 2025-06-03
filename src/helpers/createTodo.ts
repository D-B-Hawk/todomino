import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

import type { Todo } from "../types";

type TodoArgs = Partial<Pick<Todo, "description" | "dependsOn" | "list">>;

export function createTodo(args: TodoArgs = {}): Todo {
  const {
    description = faker.lorem.sentence(),
    list = "reminders",
    ...rest
  } = args;

  return {
    id: uuid(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description,
    list,
    ...rest,
  };
}
