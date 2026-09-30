/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0B0C',
          800: '#131315',
          700: '#1E1E21',
        },
        ivory: {
          DEFAULT: '#F4EFE6',
          50: '#FCFAF6',
          200: '#E6DFD3',
        },
        mist: {
          DEFAULT: '#9B968D',
          400: '#BDB8AE',
          700: '#6B675F',
        },
        signal: {
          DEFAULT: '#FF3B14',
          700: '#C22F0F',
        },
      },
      fontFamily: {
        display: [
          '"FSP DEMO - PODIUM Sharp 4.11"',
          'Impact',
          'Haettenschweiler',
          'Arial Narrow',
          'sans-serif',
        ],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1440px',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(26px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        cueBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        slowZoom: 'slowZoom 26s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        cueBounce: 'cueBounce 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
