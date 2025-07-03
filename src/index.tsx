/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { App } from "./App.tsx";
import { DexieProvider } from "./context/Dexie/DexieCtx.tsx";

const root = document.getElementById("root");

render(
  () => (
    <DexieProvider>
      <App />
    </DexieProvider>
  ),
  root!,
);
