import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme: Jet Black #0A0A0A · Cerulean Blue #007BA7 · Neon Rose #FF2D95
        background: '#0A0A0A',
        surface: '#121212',
        primary: {
          DEFAULT: '#007BA7',
          50: '#E6F4F9',
          400: '#2FA6D1',
          500: '#007BA7',
          600: '#006A91',
          700: '#00587A',
        },
        accent: {
          DEFAULT: '#FF2D95',
          400: '#FF5CAD',
          500: '#FF2D95',
          600: '#E01580',
        },
        // the "cyan" name is kept so existing classes keep working; it is now Neon Rose
        cyan: {
          DEFAULT: '#FF2D95',
          400: '#FF5CAD',
          500: '#FF2D95',
        },
        // neutral greys (instead of blue-tinted slate) so text matches the jet-black background
        slate: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #007BA7 0%, #FF2D95 100%)',
        'mesh': 'radial-gradient(at 20% 20%, rgba(0,123,167,0.20) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255,45,149,0.14) 0px, transparent 50%), radial-gradient(at 60% 80%, rgba(0,123,167,0.14) 0px, transparent 50%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        shimmer: 'shimmer 2s infinite',
        'spin-slow': 'spin-slow 18s linear infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
