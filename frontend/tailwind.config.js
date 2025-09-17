/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
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
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          'white-strong': 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.2)',
          'dark-strong': 'rgba(0, 0, 0, 0.4)',
          primary: 'rgba(14, 165, 233, 0.2)',
          secondary: 'rgba(168, 85, 247, 0.2)',
          accent: 'rgba(59, 130, 246, 0.15)',
        },
        dark: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
        },
        gradient: {
          'light-start': '#667eea',
          'light-middle': '#764ba2',
          'light-end': '#f093fb',
          'dark-start': '#0f172a',
          'dark-middle': '#1e293b',
          'dark-end': '#334155',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'premium-float': 'premiumFloat 25s ease-in-out infinite',
        'orb-pulse': 'orbPulse 4s ease-in-out infinite',
        'gentle-float': 'gentleFloat 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        premiumFloat: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
            filter: 'brightness(1) contrast(1)'
          },
          '25%': {
            transform: 'translateY(-15px) rotate(1deg)',
            filter: 'brightness(1.1) contrast(1.05)'
          },
          '50%': {
            transform: 'translateY(-30px) rotate(0deg)',
            filter: 'brightness(1.2) contrast(1.1)'
          },
          '75%': {
            transform: 'translateY(-15px) rotate(-1deg)',
            filter: 'brightness(1.1) contrast(1.05)'
          },
        },
        orbPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.7'
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '1'
          },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.5)',
        'glow-lg': '0 0 40px rgba(14, 165, 233, 0.6)',
      },
    },
  },
  plugins: [],
}
