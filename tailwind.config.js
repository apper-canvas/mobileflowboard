/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0073ea',
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0073ea',
          600: '#005bb8',
          700: '#004386',
          800: '#002b54',
          900: '#001322',
        },
        secondary: {
          DEFAULT: '#5034ff',
          50: '#f0edff',
          100: '#d1c7ff',
          200: '#b3a1ff',
          300: '#947bff',
          400: '#7555ff',
          500: '#5034ff',
          600: '#3f28cc',
          700: '#2e1c99',
          800: '#1d1066',
          900: '#0c0433',
        },
        accent: {
          DEFAULT: '#00ca72',
          50: '#e6fff2',
          100: '#b3ffd9',
          200: '#80ffc0',
          300: '#4dffa7',
          400: '#1aff8e',
          500: '#00ca72',
          600: '#00a05b',
          700: '#007644',
          800: '#004c2d',
          900: '#002216',
        },
        surface: '#ffffff',
        background: '#f6f7fb',
        success: '#00ca72',
        warning: '#fdab3d',
        error: '#e44258',
        info: '#579bfc',
        status: {
          green: '#00ca72',
          red: '#e44258',
          orange: '#fdab3d',
          blue: '#579bfc',
          purple: '#5034ff',
          yellow: '#ffd93d',
        }
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '240': '60rem',
      },
      animation: {
        'pulse-save': 'pulse-save 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
      },
      keyframes: {
        'pulse-save': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}