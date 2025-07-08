export const PICKER_COLORS = {
  RED: "#fc3a2f",
  ORANGE: "#fd9500",
  YELLOW: "#fecb00",
  GREEN: "#17c658",
  BLUE: "#0078fe",
  LIGHT_BLUE: "#50a9f0",
  IRIS: "#5754d5",
  LIPSTICK_PINK: "#e93f69",
  PURPLE: "#be77da",
  BROWN: "#9c8462",
  SLATE_GREY: "#5a666e",
  SALMON: "#d8a49e",
} as const;

export type PickerColor = keyof typeof PICKER_COLORS;

export const COLOR_PICKER_KEYS = Object.keys(PICKER_COLORS) as PickerColor[];
