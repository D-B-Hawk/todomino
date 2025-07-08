import {
  READONLY_LIST_NAMES,
  type ListName,
  type ReadOnlyListName,
} from "@/constants/lists";

export function isReadOnlyListName(
  listName: ListName | undefined,
): listName is ReadOnlyListName {
  return READONLY_LIST_NAMES.includes(listName as ReadOnlyListName);
}
