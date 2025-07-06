import { createSignal } from "solid-js";
import { getLocalStorageItem } from "./helpers";
import { getError } from "@/helpers";

export function useLocalStorage<T extends string>(
  key: string,
  defaultValue: T,
) {
  const initialValue = getLocalStorageItem(key, defaultValue);

  const [localStorageValue, setLocalStorageValue] = createSignal(initialValue);

  const setLocalStorageStateValue = (val?: string) => {
    // if val set the item and return
    if (val) {
      try {
        localStorage.setItem(key, val);
      } catch (error) {
        console.error(
          getError(error, `Failed to set key: ${key} from local storage`),
        );
      }
      return;
    }
    // else remove the item and set the local storage val to undefined
    localStorage.removeItem(key);
    setLocalStorageValue();
  };

  return [localStorageValue, setLocalStorageStateValue] as const;
}
