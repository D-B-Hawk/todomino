import { z } from "zod/v4";

export const INIT_LIST = ["reminders", "today", "completed"] as const;

export type List = (typeof INIT_LIST)[number] | (string & {});

export const LIST_UNION = z.union([z.enum(INIT_LIST), z.string().min(1)]);

export const TODO_FORM_SCHEMA = z.object({
  description: z.string().min(1),
  dependsOn: z.uuid().optional(),
  list: LIST_UNION,
});

export const LIST_FORM_SCHEMA = z.object({
  listName: LIST_UNION,
});
