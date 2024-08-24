import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/components/**/*.{ts,tsx,mdx}', './src/app/**/*.{ts,tsx,mdx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
  theme: {
    extend: {
      animation: {
        'fade-out-down': 'fade-out-down linear forwards',
        'fade-out-up': 'fade-out-up linear forwards',
        'make-it-bigger': 'make-it-bigger linear forwards',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        midnight: {
          '100': '#CFD4D8',
          '200': '#A8B0B9',
          '300': '#82899A',
          '400': '#5D607B',
          '500': '#39375B',
          '600': '#2F2D4C',
          '700': '#25243D',
          '800': '#1C1B2E',
          '900': '#12111F',
        },
      },
      keyframes: {
        'fade-out-down': {
          from: {
            opacity: '1',
            transform: 'translateY(0)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(40%)',
          },
        },
        'fade-out-up': {
          from: {
            opacity: '1',
            transform: 'translateY(0)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(-100%)',
          },
        },
        'make-it-bigger': {
          '0%': {
            transform: 'translateY(0%)',
          },
          '80%': {
            transform: 'translateY(-30%)',
          },
          '90%': {
            transform: 'translateY(-10%) scale(1.75)',
          },
          '100%': {
            transform: 'translateY(0%) scale(2)',
            opacity: '0.3',
            zIndex: '-1',
          },
        },
      },
      supports: {
        'no-scroll-driven-animations': 'not(animation-timeline: scroll())',
      },
    },
  },
}

export default config
