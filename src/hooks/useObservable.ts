import { createSignal, onCleanup } from "solid-js";
import type { Observable } from "dexie";

export function useObservable<T>(observable: Observable<T>, initialValue: T) {
  const [value, setValue] = createSignal(initialValue);
  const subscription = observable.subscribe(setValue);
  onCleanup(() => subscription.unsubscribe());
  return value;
}
