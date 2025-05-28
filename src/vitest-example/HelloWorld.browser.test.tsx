import { expect, test } from "vitest";
import { render } from "@solidjs/testing-library";
import { HelloWorld } from "./HelloWorld.tsx";

test("renders name", async () => {
  const { getByText } = render(() => <HelloWorld name="Vitest" />);
  expect(getByText("Hello Vitest!")).toBeTruthy();
});
