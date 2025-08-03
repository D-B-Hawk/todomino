import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import { Icon } from "./Icon";
import { OnClickOutsideContainer } from "./OnClickOutsideContainer";
import { useToggle } from "@/hooks";

import "wc-datepicker/dist/themes/light.css";
import { isSelectDateEvent } from "@/helpers";

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
  const [showDatePicker, { toggle }] = useToggle();

  function getDisplayedDate(date?: number) {
    if (!date) return;

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

  const displayedPick = () =>
    getDisplayedDate(props.currentDate) ?? "Pick a Date";

  const getDateInputValue = () => {
    const theDate = props.currentDate
      ? dayjs(props.currentDate).toDate()
      : undefined;
    return theDate;
  };

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
    <div class="relative inline-block border">
      <Show when={showDatePicker()}>
        <OnClickOutsideContainer
          onClickOutside={toggle}
          class="absolute top-10"
        >
          <wc-datepicker value={getDateInputValue()} ref={setDatePickerRef} />
        </OnClickOutsideContainer>
      </Show>
      <button
        type="button"
        class="flex items-center gap-2 border rounded p-2 bg-white hover:bg-gray-50 text-xs"
        onClick={toggle}
      >
        <Icon icon="CALENDAR" class="w-4" />
        {displayedPick()}
      </button>
    </div>
  );
}
