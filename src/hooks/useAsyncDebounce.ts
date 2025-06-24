import { onCleanup } from "solid-js";

//eslint-disable-next-line @typescript-eslint/no-explicit-any -- cannot reasonably restrict expected args and return type
export function useAsyncDebounce<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      asyncFn(...args);
    }, delay);
  };

  onCleanup(() => clearTimeout(timeout));

  return debounced;
}
