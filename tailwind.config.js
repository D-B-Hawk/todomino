import { SILVERBACK } from "./src/constants/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        silverback: SILVERBACK,
      },
    },
  },
  plugins: [],
};
