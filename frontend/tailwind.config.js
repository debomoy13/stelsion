/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nasa: {
          bg: "#0B0F19",
          card: "rgba(17, 24, 39, 0.7)",
          border: "rgba(34, 211, 238, 0.2)",
          primary: "#06B6D4", // Cyan
          secondary: "#3B82F6", // Blue
          accent: "#8B5CF6", // Purple
        }
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
      }
    },
  },
  plugins: [],
}
