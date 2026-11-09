import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090B",
        surface: "#18181B",
        border: "#27272A",
        pass: "#10B981",
        fail: "#EF4444",
        fg: "#FAFAFA",
        muted: "#A1A1AA",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "4px",
        md: "4px",
        lg: "6px",
      },
    },
  },
  plugins: [],
};
export default config;