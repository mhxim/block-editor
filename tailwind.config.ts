/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "disabled-300": "#666d80", // text
        "subdued-400": "#818898", // text
        "normal-500": "#666d80", // text
        "normal-100": "#DFE1E6", // text
        "normal-25": "#F6F8FA", // text
        "muted-600": "#36394a", // text
        "loud-900": "#0d0d12", // text
        "pressed-100": "#dfe1e7", // text
        "normal-50": "#eceff3",
        "primary-25": "#e5e4fb",
        "primary-100": "#5E56FF",
        "primary-300": "#211d6d",
        "danger-100": "#DF1C41",
        "neutral-0": "#F8F9FB",
      },
    }
  }
};
