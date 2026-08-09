import { describe, it, expect } from "vitest";
import { createList, DEFAULT_LIST_ARGS } from "./createList";

describe("helpers/createList", () => {
  it("can create a list with no passed args and returns a list with the expected default", () => {
    const defaultList = createList();
    expect(defaultList.name).toBe(DEFAULT_LIST_ARGS.name);
    expect(defaultList.color).toBe(DEFAULT_LIST_ARGS.color);
    expect(defaultList.icon).toBe(DEFAULT_LIST_ARGS.icon);
    expect(defaultList.createdAt).toBeTypeOf("number");
    expect(defaultList.updatedAt).toBeTypeOf("number");
    expect(defaultList.createdAt).toEqual(defaultList.updatedAt);
  });

  it("will allow for args passed to replace default args", () => {
    const argsPassedList = createList({
      name: "partial",
      color: "BLUE",
      icon: "CALENDAR",
    });
    expect(argsPassedList.name).toBe("partial");
    expect(argsPassedList.color).toBe("BLUE");
    expect(argsPassedList.icon).toBe("CALENDAR");
  });
});
