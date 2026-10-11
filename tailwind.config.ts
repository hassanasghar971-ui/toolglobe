// tailwind.config.ts
// NOTE: requires devDependencies: "tailwindcss", "postcss", "autoprefixer"
// Add to package.json devDependencies from Phase 1 before building.

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          base: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.14)",
          highlight: "rgba(255,255,255,0.25)",
        },
        brand: {
          50: "#eef4ff", 100: "#d9e6ff", 200: "#b7cfff", 300: "#8caeff",
          400: "#5f87ff", 500: "#3b63f7", 600: "#2947db", 700: "#2136ad",
          800: "#1f3089", 900: "#1d2c6e",
        },
        neon: {
          violet: "#a78bfa",
          cyan: "#22d3ee",
          pink: "#f472b6",
          emerald: "#34d399",
        },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0,0,0,0.37)",
        glow: "0 0 20px rgba(99,102,241,0.45), 0 0 60px rgba(99,102,241,0.15)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.45), 0 0 60px rgba(34,211,238,0.15)",
        "inner-glass": "inset 0 1px 0 0 rgba(255,255,255,0.15)",
      },
      borderRadius: { "3xl": "1.75rem", "4xl": "2.25rem" },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glowPulse: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glowPulse: "glowPulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        gradientShift: "gradientShift 6s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
