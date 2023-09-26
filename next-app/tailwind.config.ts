import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff6e42', // orange
        neutral: '#D1D5DB',
      },
      fontSize: {
        title: '2.5rem',
        subtitle: '2rem',
        caption: '1.25rem',
        small: '0.875rem',
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
        medium: '0 6px 15px rgba(0, 0, 0, 0.15)',
        hard: '0 10px 25px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        card: '10px',
        pill: '50px',
        circle: '50%',
      },
      backgroundOpacity: {
        10: '0.1',
        90: '0.9',
      },
      transitionDuration: {
        fast: '200ms',
        medium: '500ms',
        slow: '1000ms',
        '3000': '3000ms',
        '0': '0ms',
      },
      spacing: {
        18: '4.5rem',
      },
      backgroundImage: {
        gradientRadial:
          'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        start: '#ffed4a',
        end: '#d7385e',
      },
    },
  },
  plugins: [],
};

export default config;
