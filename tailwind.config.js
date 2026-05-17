/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        "bg-card": "rgb(var(--bg-card-rgb) / <alpha-value>)",
        text: "rgb(var(--text-rgb) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted-rgb) / <alpha-value>)",
        green: "rgb(var(--green-rgb) / <alpha-value>)",
        "green-light": "rgb(var(--green-light-rgb) / <alpha-value>)",
        brown: "rgb(var(--brown-rgb) / <alpha-value>)",
        "brown-light": "rgb(var(--brown-light-rgb) / <alpha-value>)",
        border: "rgb(var(--border-rgb) / <alpha-value>)",
        input: "rgb(var(--border-rgb) / <alpha-value>)",
        ring: "rgb(var(--green-rgb) / <alpha-value>)",
        background: "rgb(var(--bg-rgb) / <alpha-value>)",
        foreground: "rgb(var(--text-rgb) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--green-rgb) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--green-light-rgb) / <alpha-value>)",
          foreground: "rgb(var(--green-rgb) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--bg-card-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-muted-rgb) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--green-light-rgb) / <alpha-value>)",
          foreground: "rgb(var(--green-rgb) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--bg-card-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-rgb) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--bg-card-rgb) / <alpha-value>)",
          foreground: "rgb(var(--text-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ['"Source Serif 4"', "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
