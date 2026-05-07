import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ok: {
          primary: {
            DEFAULT: '#c84e00',
            hover: '#a13e00',
            active: '#7a2f00',
            50: '#fff7eb',
            100: '#fde8c6',
            200: '#fbcd8a',
            300: '#f8a94a',
            400: '#f48518',
            500: '#c84e00',
            600: '#a13e00',
            700: '#7a2f00',
            800: '#532000',
            900: '#2c1100',
          },
          gold: {
            DEFAULT: '#b8860b',
            hover: '#9a710a',
            soft: '#daa520',
            deep: '#856209',
          },
          text: {
            primary: '#0d0d0d',
            secondary: '#525252',
            tertiary: '#737373',
            inverse: '#ffffff',
          },
          bg: {
            primary: '#ffffff',
            secondary: '#fef9f3',
            tertiary: '#fff7eb',
          },
          border: {
            DEFAULT: '#e7d3b3',
            strong: '#d4b481',
          },
          success: { DEFAULT: '#15803d', bg: '#dcfce7' },
          warning: { DEFAULT: '#a16207', bg: '#fef3c7' },
          error: { DEFAULT: '#b91c1c', bg: '#fee2e2' },
          info: '#1e40af',
        },
      },
      fontFamily: {
        headline: ['var(--font-source-serif)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        'sm-warm': '0 1px 2px 0 rgb(200 78 0 / 0.08)',
        'md-warm': '0 4px 6px -1px rgb(200 78 0 / 0.08), 0 2px 4px -2px rgb(200 78 0 / 0.04)',
        'lg-warm': '0 10px 15px -3px rgb(200 78 0 / 0.06), 0 4px 6px -4px rgb(200 78 0 / 0.04)',
        'xl-warm': '0 20px 25px -5px rgb(200 78 0 / 0.06), 0 8px 10px -6px rgb(200 78 0 / 0.04)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
