import type { DOMElement } from "solid-js/jsx-runtime";
import { LIST_UNION } from "./constants";
import type { z } from "zod/v4";

export type List = z.infer<typeof LIST_UNION>;

export type FormSubmitEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export type Todo = {
  id: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  dependsOn?: Todo["id"];
  dependent?: Todo["id"];
  list: List;
};
