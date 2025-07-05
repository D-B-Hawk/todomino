import { createSignal, onMount } from "solid-js";

export function useMatchMedia(query: string) {
  const [matches, setMatches] = createSignal(false);
  const mediaQuery = window.matchMedia(query);

  setMatches(mediaQuery.matches);
  onMount(() => {
    mediaQuery.addEventListener("change", (e) => {
      if (e.matches) {
        setMatches(true);
        return;
      }
      setMatches(false);
    });
  });

  return matches;
}
