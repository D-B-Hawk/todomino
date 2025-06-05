import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

import { type Todo } from "../types";

type TodoArgs = Partial<Pick<Todo, "description" | "dependsOn" | "list">>;

export function createTodo(args: TodoArgs = {}): Todo {
  const {
    description = faker.lorem.sentence(),
    list = "reminders",
    ...rest
  } = args;

  const now = Date.now();

  return {
    id: uuid(),
    createdAt: now,
    updatedAt: now,
    description,
    list,
    ...rest,
  };
}
