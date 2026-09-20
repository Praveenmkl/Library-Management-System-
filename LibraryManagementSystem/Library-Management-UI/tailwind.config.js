/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        brand: {
          50: 'rgb(var(--brand-50-rgb, 255 251 235) / <alpha-value>)',
          100: 'rgb(var(--brand-100-rgb, 254 243 199) / <alpha-value>)',
          200: 'rgb(var(--brand-200-rgb, 253 230 138) / <alpha-value>)',
          300: 'rgb(var(--brand-300-rgb, 252 211 77) / <alpha-value>)',
          400: 'rgb(var(--brand-400-rgb, 251 191 36) / <alpha-value>)',
          500: 'rgb(var(--brand-500-rgb, 245 158 11) / <alpha-value>)',
          600: 'rgb(var(--brand-600-rgb, 217 119 6) / <alpha-value>)',
          700: 'rgb(var(--brand-700-rgb, 180 83 9) / <alpha-value>)',
          800: 'rgb(var(--brand-800-rgb, 146 64 14) / <alpha-value>)',
          900: 'rgb(var(--brand-900-rgb, 120 53 15) / <alpha-value>)',
          950: 'rgb(var(--brand-950-rgb, 69 26 3) / <alpha-value>)',
          DEFAULT: 'rgb(var(--brand-500-rgb, 245 158 11) / <alpha-value>)',
        },
        librarian: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
          DEFAULT: '#a855f7',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
