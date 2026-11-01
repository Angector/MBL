import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: token('cream'),
        ivory: token('ivory'),
        beige: token('beige'),
        olive: { DEFAULT: token('olive'), muted: token('olive-muted'), deep: token('forest') },
        terracotta: token('terracotta'),
        ink: token('ink'),
        subtle: token('subtle'),
        line: token('line'),
      },
      boxShadow: { soft: '0 14px 34px -18px rgb(52 61 44 / 0.28)' },
      maxWidth: { site: '1280px' },
      transitionTimingFunction: { soft: 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
    },
  },
  plugins: [],
};
export default config;
