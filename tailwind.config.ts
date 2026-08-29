import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#15171A",
        surface: "#1E2124",
        "border-line": "#33373C",
        ivory: "#F3F0E8",
        "muted-text": "#93979C",
        sage: {
          DEFAULT: "#7FA98A",
          dark: "#5C8268",
          light: "#A4C4AC",
          muted: "rgba(127, 169, 138, 0.15)",
        },
        brass: {
          DEFAULT: "#C6A75C",
          dark: "#A38641",
          light: "#DEC07D",
          muted: "rgba(198, 167, 92, 0.15)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Fraunces", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        utility: ["var(--font-monic)", "var(--font-ibm-plex-mono)", "Monic", "IBM Plex Mono", "monospace", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      lineHeight: {
        tightest: "1.05",
      },
      boxShadow: {
        "sage-glow": "0 0 25px -5px rgba(127, 169, 138, 0.3)",
        "brass-glow": "0 0 20px -5px rgba(198, 167, 92, 0.25)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
