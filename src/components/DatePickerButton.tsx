import { createSignal } from "solid-js";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import isYesterday from "dayjs/plugin/isYesterday";
import { Icon } from "./Icon";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(isYesterday);

interface DateButtonProps {
  currentDate?: number;
  onDateChange: (date: number) => void;
}

export function DatePickerButton(props: DateButtonProps) {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const openDatePicker = () => {
    if (inputRef()?.showPicker) {
      inputRef()?.showPicker();
    } else {
      inputRef()?.focus();
    }
  };

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

  const getDateInputValue = () => dayjs(props.currentDate).format("YYYY-MM-DD");

  return (
    <div class="relative inline-block">
      <input
        ref={setInputRef}
        type="date"
        class="opacity-0 absolute left-0 top-0 w-full h-full z-[-1]"
        value={getDateInputValue()}
        onChange={(e) => {
          const value = dayjs(e.currentTarget.value).valueOf();
          props.onDateChange(value);
        }}
      />
      <button
        type="button"
        class="flex items-center gap-2 border rounded p-2 bg-white hover:bg-gray-50 text-xs"
        onClick={openDatePicker}
      >
        <Icon icon="CALENDAR" class="w-4" />
        {displayedPick()}
      </button>
    </div>
  );
}
