import type { Todo } from "@/types";
import { createTodo } from "./createTodo";

export function createFakeTodos(length: number = 1): Todo[] {
  return Array.from({ length }, createTodo);
}
