import type { DOMElement } from "solid-js/jsx-runtime";
import { IconKey, INIT_LIST_NAMES } from "./constants";

export type ListName = (typeof INIT_LIST_NAMES)[number] | (string & {});

export type FormSubmitEvent = SubmitEvent & {
  currentTarget: HTMLFormElement;
  target: DOMElement;
};

export type List = {
  name: ListName;
  color: string;
  icon: IconKey;
  createdAt: number;
  updatedAt: number;
};

export type Todo = {
  id: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  dependsOn?: Todo["id"];
  dependent?: Todo["id"];
  list: ListName;
};
