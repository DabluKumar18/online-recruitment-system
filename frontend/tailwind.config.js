/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f6f8",
          100: "#e6eaee",
          200: "#c7d0da",
          300: "#9fadbd",
          400: "#6b7c90",
          500: "#4a5c70",
          600: "#374759",
          700: "#293747",
          800: "#1b2634",
          900: "#0f1720",
          950: "#0a0f16",
        },
        brand: {
          50: "#eef7f4",
          100: "#d6ece3",
          200: "#aed9c9",
          300: "#7dbfab",
          400: "#4a9d89",
          500: "#2f7f6d",
          600: "#1f6657",
          700: "#1a5347",
          800: "#17423a",
          900: "#143631",
          950: "#0a1e1a",
        },
        amber: {
          50: "#fdf8ec",
          100: "#faedc7",
          200: "#f5da8f",
          300: "#efc158",
          400: "#e8a934",
          500: "#d88f22",
          600: "#b6701b",
          700: "#92551a",
          800: "#77441c",
          900: "#63391c",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,32,0.06), 0 1px 12px rgba(15,23,32,0.04)",
        pop: "0 8px 30px rgba(15,23,32,0.12)",
      },
    },
  },
  plugins: [],
};
