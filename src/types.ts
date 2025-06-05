import type { INIT_LIST } from "./constants";

export type List = (typeof INIT_LIST)[number] | (string & {});

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
