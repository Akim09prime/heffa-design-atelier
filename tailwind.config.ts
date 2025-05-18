
import type { Config } from 'tailwindcss';
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        wood: '#6A4B31',
        gold: '#C1A57B',
        heffa: {
          50: '#F2FCE2',
          100: '#E5F8C3',
          200: '#D5F4A5',
          300: '#B8E86B',
          400: '#A0DB3E',
          500: '#84C21E',
          600: '#67981A',
          700: '#4C7015',
          800: '#324B10',
          900: '#1A260A',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        admin: {
          950: '#0f1117',
          900: '#131620',
          800: '#1A1F2C',
          700: '#272d3d',
          600: '#323a50',
          500: '#414b68',
          400: '#596180',
          300: '#7480a1',
          200: '#9eabc2',
          100: '#c8d0e2',
          50: '#f1f3f9',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft': '0 10px 25px rgba(0, 0, 0, 0.05)',
        'glass': '0 0 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
