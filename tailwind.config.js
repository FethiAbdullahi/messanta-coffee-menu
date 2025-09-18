/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Harari-inspired color palette
        primary: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8b86d',
          400: '#f59433',
          500: '#f2760b',
          600: '#e35d06',
          700: '#bc4508',
          800: '#95370e',
          900: '#782f0f',
        },
        secondary: {
          50: '#f8f5f0',
          100: '#ede6d8',
          200: '#dacbb0',
          300: '#c2a882',
          400: '#a88a5a',
          500: '#8b6f47',
          600: '#6d5638',
          700: '#56442e',
          800: '#463829',
          900: '#3b3024',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        'sans': ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
        'sora': ['Sora', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
