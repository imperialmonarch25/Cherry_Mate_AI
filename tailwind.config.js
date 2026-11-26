/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        papyrus: "#f4dfb4",
        oasis: "#176b66",
        ink: "#2b1b12",
      },
    },
  },
  plugins: [],
};
