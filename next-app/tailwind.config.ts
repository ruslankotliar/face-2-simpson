import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFDB00', // Simpsons yellow
        secondary: '#87C442', // Bart's T-shirt green
        highlight: '#36A2C2', // Marge's hair blue
        tertiary: '#E31D27', // Bart's shorts red
        neutral: '#D1D5DB',
      },
      fontSize: {
        title: '2rem',
        subtitle: '1.5rem',
        caption: '0.875rem',
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
      keyframes: {
        // Simple animations for added flair
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-30px)' },
          '60%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        bounce: 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
