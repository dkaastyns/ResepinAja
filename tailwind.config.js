/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6',
        surface: '#FFFFFF',
        'green-primary': '#557A46',
        'green-secondary': '#8DAA75',
        'green-dark': '#3D5832',
        'accent-orange': '#E99552',
        'accent-orange-dark': '#D87C33',
        'cream': '#F1EBDD',
        'cream-light': '#F8F5EE',
        'text-primary': '#252820',
        'text-secondary': '#77786F',
        'text-muted': '#A4A59E',
        'border-color': '#EAE8E1',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 14px -2px rgba(37, 40, 32, 0.06), 0 1px 3px 0 rgba(37, 40, 32, 0.04)',
        'card-hover': '0 16px 32px -4px rgba(37, 40, 32, 0.12), 0 4px 12px -2px rgba(37, 40, 32, 0.05)',
        'float': '0 20px 40px -8px rgba(85, 122, 70, 0.25)',
        'nav': '0 -4px 20px 0 rgba(37, 40, 32, 0.06)',
        'glow-green': '0 0 20px 0 rgba(85, 122, 70, 0.35)',
        'glow-orange': '0 0 20px 0 rgba(233, 149, 82, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'heart-pop': 'heartPop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'card-enter': 'cardEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '35%': { transform: 'scale(1.35)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        cardEnter: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
