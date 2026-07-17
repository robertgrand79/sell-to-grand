import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c2430",
        slatey: "#4a5568",
        line: "#e3e6ea",
        accent: "#1f6f6b",
        accentdark: "#175653",
        wash: "#f5f6f4",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "68rem",
      },
    },
  },
  plugins: [],
};

export default config;
