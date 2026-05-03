import type { Todo } from "@/types";

export function hasTodominoIndex(
  todo: Todo,
): todo is Todo & { dominoIndex: number } {
  return todo.dominoIndex !== undefined;
}
