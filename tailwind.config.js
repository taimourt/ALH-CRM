/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
        border: 'hsl(var(--border))',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        alh: {
          black: '#000000',
          white: '#FEFEFE',
          charcoal: '#222222',
          'gray-700': '#444444',
          'gray-500': '#666666',
          'gray-300': '#BDBDBD',
          'gray-200': '#E5E5E5',
          'gray-100': '#F4F4F4',
        },
        brand: {
          50: '#f4f4f4',
          100: '#e5e5e5',
          200: '#bdbdbd',
          300: '#777777',
          400: '#444444',
          500: '#222222',
          600: '#1a1a1a',
          700: '#111111',
          800: '#0a0a0a',
          900: '#000000',
          950: '#000000',
        },
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
        signature: ['Caveat', 'Playfair Display', 'cursive', 'serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      }
    },
  },
  plugins: [],
}

