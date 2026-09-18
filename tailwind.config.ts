import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E23744',
          hover: '#B91C2B',
          dark: '#B91C2B',
          light: '#FFF1F2',
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#E23744',
          600: '#B91C2B',
          700: '#991B1B',
        },
        primary: {
          DEFAULT: '#E23744',
          dark: '#B91C2B',
          light: '#FFF1F2',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F8F8',
          card: '#FFFFFF',
          border: '#E8E8E8',
        },
        status: {
          success: '#2E9B5B',
          warning: '#F59E0B',
          danger: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(0, 0, 0, 0.05)',
        card: '0 2px 12px -2px rgba(28, 28, 28, 0.06)',
        'card-hover': '0 8px 24px -4px rgba(28, 28, 28, 0.12)',
        float: '0 10px 30px -5px rgba(226, 55, 68, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
