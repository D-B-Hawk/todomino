import { z } from "zod/v4";

export const INIT_LIST = ["reminders", "today", "completed"] as const;

const INIT_LIST_LIT = z.literal([...INIT_LIST]);

const STRING_OBJECT_INT = z.intersection(z.string(), z.object());

export const LIST_UNION = z.union([INIT_LIST_LIT, STRING_OBJECT_INT]);

export const TODO_FORM_SCHEMA = z.object({
  description: z.string().min(1),
  dependsOn: z.uuid().optional(),
  list: LIST_UNION,
});
