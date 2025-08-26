/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nueva paleta de colores
        primary: {
          DEFAULT: '#001D23',
          50: '#e6f2f3',
          100: '#cce5e7',
          200: '#99cbcf',
          300: '#66b1b7',
          400: '#33979f',
          500: '#007d87',
          600: '#00636c',
          700: '#004951',
          800: '#002f36',
          900: '#001D23',
        },
        secondary: {
          DEFAULT: '#00303F',
          50: '#e6f0f3',
          100: '#cce1e7',
          200: '#99c3cf',
          300: '#66a5b7',
          400: '#33879f',
          500: '#006987',
          600: '#00546c',
          700: '#003f51',
          800: '#002a36',
          900: '#00303F',
        },
        tertiary: {
          DEFAULT: '#003E5E',
          50: '#e6f1f7',
          100: '#cce3ef',
          200: '#99c7df',
          300: '#66abcf',
          400: '#338fbf',
          500: '#0073af',
          600: '#005c8c',
          700: '#004569',
          800: '#002e46',
          900: '#003E5E',
        },
        accent: {
          DEFAULT: '#6BC6C9',
          50: '#f0fafb',
          100: '#e1f5f6',
          200: '#c3ebed',
          300: '#a5e1e4',
          400: '#87d7db',
          500: '#6BC6C9',
          600: '#559ea1',
          700: '#3f7779',
          800: '#2a4f51',
          900: '#142829',
        },
        // Colores adicionales para compatibilidad
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        white: '#ffffff',
        black: '#000000',
      },
      fontFamily: {
        // Fuentes principales
        primary: [
          'Avenir Next',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        secondary: [
          'Raleway',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
        // Alias para compatibilidad
        sans: [
          'Raleway',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          'Avenir Next',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif'
        ],
        mono: [
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 29, 35, 0.07), 0 10px 20px -2px rgba(0, 29, 35, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 29, 35, 0.1), 0 10px 10px -5px rgba(0, 29, 35, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 29, 35, 0.15), 0 2px 10px -5px rgba(0, 29, 35, 0.04)',
        'accent': '0 10px 25px rgba(107, 198, 201, 0.3)',
        'primary': '0 10px 25px rgba(0, 29, 35, 0.3)',
      },
      animation: {
        // Animaciones existentes
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shine': 'shine 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Plugin personalizado para utilidades adicionales
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 29, 35, 0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 29, 35, 0.2)',
        },
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)',
        },
        '.gradient-primary': {
          background: 'linear-gradient(135deg, #001D23 0%, #00303F 100%)',
        },
        '.gradient-secondary': {
          background: 'linear-gradient(135deg, #00303F 0%, #003E5E 100%)',
        },
        '.gradient-accent': {
          background: 'linear-gradient(135deg, #6BC6C9 0%, #5ab5b8 100%)',
        },
        '.gradient-overlay-dark': {
          background: 'linear-gradient(to top, rgba(0, 29, 35, 0.8), transparent)',
        },
        '.gradient-overlay-light': {
          background: 'linear-gradient(to top, rgba(0, 29, 35, 0.4), transparent)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};