import { createEffect, createSignal, onCleanup, type Accessor } from "solid-js";
import type { Observable } from "dexie";

export function useObservable<T>(
  observable: Accessor<Observable<T>>,
  initialValue: T,
) {
  const [value, setValue] = createSignal(initialValue);
  let subscription = observable().subscribe(setValue);

  createEffect(() => {
    // reset the subscription when the observable changes
    subscription.unsubscribe();
    subscription = observable().subscribe(setValue);
  });

  onCleanup(() => subscription.unsubscribe());
  return value;
}
