/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#c026d3",
          600: "#a21caf",
          700: "#86198f",
          800: "#701a75",
          900: "#4a044e",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          400: "#94a3b8",
          600: "#475569",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
