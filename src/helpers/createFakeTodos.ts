import type { Todo } from "../types";
import { faker } from "@faker-js/faker";

export function createFakeTodos(length: number = 1): Todo[] {
  return Array.from(
    { length },
    (): Todo => ({
      id: faker.string.uuid(),
      description: faker.lorem.sentence(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  );
}
