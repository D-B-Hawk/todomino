import type { WcDatepickerCustomEvent } from "wc-datepicker";

export function isSelectDateEvent(
  e: Event,
): e is WcDatepickerCustomEvent<string | string[] | undefined> {
  return (
    e instanceof CustomEvent &&
    typeof (e as CustomEvent).detail !== "symbol" &&
    (typeof e.detail === "string" ||
      Array.isArray(e.detail) ||
      typeof e.detail === "undefined") &&
    "target" in e &&
    (e.target as Element)?.tagName === "WC-DATEPICKER"
  );
}
