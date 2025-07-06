import { getError } from "@/helpers";

export function getLocalStorageItem<T extends string>(
  key: string,
  defaultValue: T,
) {
  const value = localStorage.getItem(key);

  if (value) {
    return value as T;
  }

  if (defaultValue) {
    try {
      localStorage.setItem(key, defaultValue);
    } catch (error) {
      console.error(
        getError(error, `Failed to get key: ${key} from local storage`),
      );
    }
  }
}
