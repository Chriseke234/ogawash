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
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#D1FAE5",
          muted: "rgba(16, 185, 129, 0.12)",
        },
        brand: {
          DEFAULT: "#10B981",
          dark: "#059669",
          light: "#ECFDF5",
          accent: "#0D9488",
        },
        slate: {
          850: "#151F32",
          950: "#0B1120",
        },
        ink: {
          DEFAULT: "#0F172A",
          dark: "#0A0F1D",
          light: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-fraunces)", "Fraunces", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        utility: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        "emerald-glow": "0 10px 25px -5px rgba(16, 185, 129, 0.3)",
        "card-soft": "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 12px 30px -4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
