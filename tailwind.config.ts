import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tg: {
          bg: "var(--tg-bg)",
          sidebar: "var(--tg-sidebar)",
          panel: "var(--tg-panel)",
          header: "var(--tg-header)",
          border: "var(--tg-border)",
          text: "var(--tg-text)",
          muted: "var(--tg-muted)",
          accent: "var(--tg-accent)",
          accentHover: "var(--tg-accent-hover)",
          bubbleOwn: "var(--tg-bubble-own)",
          bubbleOther: "var(--tg-bubble-other)",
          input: "var(--tg-input)",
          hover: "var(--tg-hover)",
        },
      },
      boxShadow: {
        bubble: "0 1px 2px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
