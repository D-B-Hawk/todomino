export const DEFAULT_LISTS = ["reminders", "today", "completed"] as const;
type DefaultList = (typeof DEFAULT_LISTS)[number];

export type List = DefaultList | (string & {});

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
