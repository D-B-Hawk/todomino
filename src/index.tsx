/* @refresh reload */
import { render } from "solid-js/web";
import { WcDatepicker } from "wc-datepicker/dist/components/wc-datepicker";
import "./index.css";
import { App } from "./App.tsx";
import { DexieProvider } from "@/context";

customElements.define("wc-datepicker", WcDatepicker);

const root = document.getElementById("root");

render(
  () => (
    <DexieProvider>
      <App />
    </DexieProvider>
  ),
  root!,
);
