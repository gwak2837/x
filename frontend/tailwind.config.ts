import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/components/**/*.{ts,tsx,mdx}', './src/app/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
