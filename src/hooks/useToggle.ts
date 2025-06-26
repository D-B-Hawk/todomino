import { createSignal } from "solid-js";

export function useToggle(on: boolean = false) {
  const [isOn, setIsOn] = createSignal(on);

  function toggle() {
    setIsOn((cur) => !cur);
  }

  return [isOn, { toggle }] as const;
}
