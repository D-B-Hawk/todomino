import { createEffect, createSignal, on, onCleanup } from "solid-js";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";

import "wc-datepicker/dist/themes/light.css";
import { isSelectDateEvent } from "@/helpers";
import { PopUpMenu } from "./PopUpMenu";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

interface DatePickerProps {
  currentDate?: number;
  onDateChange: (date: number) => void;
}

export function DatePicker(props: DatePickerProps) {
  const [datePickerRef, setDatePickerRef] =
    createSignal<HTMLWcDatepickerElement>();

  function getDisplayedDate(date: number) {
    const day = dayjs(date);
    if (day.isTomorrow()) {
      return "Tomorrow";
    }
    if (day.isToday()) {
      return "Today";
    }
    if (day.isYesterday()) {
      return "Yesterday";
    }
    return day.format("M/D/YY");
  }

  function displayedPick() {
    if (props.currentDate) {
      return getDisplayedDate(props.currentDate);
    }
    return "Pick a Date";
  }

  function getDateInputValue() {
    let theDate: Date | undefined = undefined;
    if (props.currentDate) {
      theDate = dayjs(props.currentDate).toDate();
    }
    return theDate;
  }

  function handleDateEvent(e: Event) {
    if (!isSelectDateEvent(e)) {
      console.error("event is not a select date event", e);
      return;
    }
    if (typeof e.detail !== "string") {
      console.error("cannot ingest detail that is not of type string");
      return;
    }

    props.onDateChange(dayjs(e.detail).valueOf());
  }

  createEffect(
    on(
      datePickerRef,
      (datePicker) => {
        if (datePicker) {
          datePicker.addEventListener("selectDate", handleDateEvent);
        }
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    datePickerRef()?.removeEventListener("selectDate", handleDateEvent);
  });

  return (
    <PopUpMenu
      class="text-sm p-1 rounded-md h-full"
      clickOutsideContainerClass="left-1 top-10 w-fit"
      iconButtonProps={{
        iconProps: {
          icon: "CALENDAR",
        },
        children: displayedPick(),
        class: "bg-black/5 hover:bg-black/15",
      }}
    >
      <wc-datepicker value={getDateInputValue()} ref={setDatePickerRef} />
    </PopUpMenu>
  );
}
