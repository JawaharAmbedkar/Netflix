/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "rgb(10 9 8 / <alpha-value>)",
          elevated: "#12100e",
          surface: "#1a1714",
        },
        gold: {
          DEFAULT: "rgb(201 169 98 / <alpha-value>)",
          light: "#dfc88a",
          muted: "#a0884a",
          glow: "rgba(201, 169, 98, 0.35)",
        },
        warm: {
          50: "#faf8f5",
          100: "#f0ebe3",
          200: "#ddd4c8",
          300: "#c4b8a8",
          400: "#a89888",
          500: "#8a7a6a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        glow: "0 0 40px rgba(201, 169, 98, 0.15)",
        card: "0 12px 40px rgba(0, 0, 0, 0.5)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(201, 169, 98, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
