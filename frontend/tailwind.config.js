/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'mystic-teal': {
          'primary': '#002C4D',
          'secondary': '#012145',
          'tertiary': '#051D43',
          'accent': '#3AA0B7',
        },
        'neon-lime': '#E7FF00',
        'neural-mint': '#D8ECD1',
        'brand': {
          'primary': '#002C4D',
          'secondary': '#012145',
          'accent': '#3AA0B7',
          'lime': '#E7FF00',
          'mint': '#D8ECD1',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(0, 44, 77, 0.1)',
        'brand-lg': '0 10px 25px -3px rgba(0, 44, 77, 0.1), 0 4px 6px -2px rgba(0, 44, 77, 0.05)',
      },
      backgroundImage: {
        'brand-pattern': `
          radial-gradient(circle at 25% 25%, rgba(58, 160, 183, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(231, 255, 0, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(216, 236, 209, 0.08) 0%, transparent 50%)
        `,
      }
    },
  },
  plugins: [],
}