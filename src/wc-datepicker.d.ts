import "solid-js";
import type { JSX as DatePickerJSX } from "wc-datepicker";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "wc-datepicker": DatePickerJSX.WcDatepicker &
        JSX.HTMLAttributes<HTMLWcDatepickerElement>;
    }
  }
}
