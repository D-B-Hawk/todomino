import { v4 as uuid } from "uuid";

import { type Todo } from "../types";

export function createTodo(args: Partial<Todo> = {}): Todo {
  const now = Date.now();

  const {
    id = uuid(),
    createdAt = now,
    updatedAt = now,
    description = "New reminder",
    list = "reminders",
    ...rest
  } = args;

  return {
    id,
    createdAt,
    updatedAt,
    description,
    list,
    ...rest,
  };
}
