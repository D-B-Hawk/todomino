import { READONLY_LIST_NAMES } from "@/constants";
import type { ListName, RestrictedListName } from "@/types";

export function isRestrictedListName(
  listName: ListName | undefined,
): listName is RestrictedListName {
  return READONLY_LIST_NAMES.includes(listName as RestrictedListName);
}
