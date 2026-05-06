import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** Exposes every Tailwind color as a CSS variable, e.g. var(--blue-500) */
function addVariablesForColors({ addBase, theme }: { addBase: (rules: Record<string, Record<string, string>>) => void; theme: (key: string) => Record<string, string> }) {
  const allColors = flattenColorPalette(theme("colors")) as Record<string, string>;
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );
  addBase({ ":root": newVars });
}

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0F",
        paper: "#F9F7F3",
        "paper-pure": "#FFFFFF",
        surface: "#EFECE5",
        hairline: "#E5E1D7",
        "ink-soft": "#5C5A55",
        "ink-muted": "#8A8780",
        "intro-bg": "#06080F",
        "intro-line": "#1E293B",
        accent: {
          DEFAULT: "#1E3A8A",
          glow: "#3B82F6",
        },
        warm: {
          terracotta: "#D1543E",
          sand: "#EAC7A0",
          olive: "#A4A38F",
          ink: "#302F47",
          rose: "#C1768D",
          slate: "#32516D",
        },
      },
      fontFamily: {
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "drift-x": {
          "0%, 100%": { transform: "translateX(-8px)" },
          "50%": { transform: "translateX(8px)" },
        },
        "glow-drift": {
          "0%, 100%": { transform: "translate(-4%, -2%) scale(1)" },
          "50%": { transform: "translate(4%, 2%) scale(1.05)" },
        },
        "marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "drift-x":       "drift-x 20s ease-in-out infinite",
        "glow-drift":    "glow-drift 30s ease-in-out infinite",
        "marquee-left":  "marquee-left 40s linear infinite",
        "marquee-right": "marquee-right 40s linear infinite",
      },
    },
  },
  plugins: [addVariablesForColors],
};

export default config;
