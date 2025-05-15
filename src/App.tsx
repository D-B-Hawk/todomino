import { createSignal } from "solid-js";

export function App() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="flex flex-col items-center border border-red-500">
      {count()}
      <button on:click={() => setCount((curCount) => curCount + 1)}>
        increaseCount
      </button>
      <button
        on:click={() =>
          setCount((curCount) => (curCount ? curCount - 1 : curCount))
        }
      >
        decreaseCount
      </button>
    </div>
  );
}
