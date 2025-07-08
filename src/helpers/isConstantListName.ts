import {
  INITIAL_LIST_NAMES,
  type ListName,
  type MainListName,
  type ReadOnlyListName,
} from "@/constants/lists";

export function isConstantListName(
  listName: ListName | undefined,
): listName is ReadOnlyListName | MainListName {
  return INITIAL_LIST_NAMES.includes(
    listName as ReadOnlyListName | MainListName,
  );
}
