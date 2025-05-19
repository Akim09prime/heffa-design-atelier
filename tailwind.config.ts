
import type { Config } from 'tailwindcss';
import { fontFamily } from "tailwindcss/defaultTheme";
import { adminColors } from "./src/styles/admin-theme";

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
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        // Admin theme colors (direct values)
        ...adminColors,
        
        // Original colors
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
        // Role-specific color palettes
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
          primary: '#2563eb',
          secondary: '#f7fafc',
          accent: '#1e40af',
          muted: '#374151',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        designer: {
          950: '#0a192f',
          900: '#112240',
          800: '#233554',
          700: '#39506e',
          600: '#4c6685',
          500: '#617da9',
          400: '#8497b7',
          300: '#a8b2d1',
          200: '#ccd6f6',
          100: '#e6f1ff',
          50: '#f5f9ff',
          primary: '#3dd5f3',
          secondary: '#f8f9fa',
          accent: '#5c7cfa',
          muted: '#64748b',
          glow: 'rgba(61, 213, 243, 0.6)',
        },
        client: {
          950: '#042f2e',
          900: '#083f3e',
          800: '#0f5855',
          700: '#147370',
          600: '#199f9c',
          500: '#20c7c3',
          400: '#2ee9e4',
          300: '#6df2ee',
          200: '#a7f7f5',
          100: '#d1fbfa',
          50: '#e0f2f1',
          primary: '#0d9488',
          secondary: '#e0f2f1',
          accent: '#14b8a6',
          muted: '#475569',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft': '0 10px 25px rgba(0, 0, 0, 0.05)',
        'glass': '0 0 20px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(61, 213, 243, 0.5)',
        'admin-glow': '0 0 15px rgba(37, 99, 235, 0.5)',
        'client-glow': '0 0 15px rgba(13, 148, 136, 0.5)',
        'neumorphic': '5px 5px 10px #d9d9d9, -5px -5px 10px #ffffff',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'bounce-sm': 'bounce-sm 1s infinite',
      },
      keyframes: {
        'bounce-sm': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
