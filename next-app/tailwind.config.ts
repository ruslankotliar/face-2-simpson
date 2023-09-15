import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Extended colors for enhanced UI variations
      colors: {
        primary: '#6B7280',
        secondary: '#93C5FD',
        highlight: '#FCD34D',
        tertiary: '#A78BFA', // Soft purple for tertiary elements or backgrounds
        neutral: '#D1D5DB', // Neutral background or disabled elements
      },
      fontSize: {
        title: '2rem',
        subtitle: '1.5rem',
        caption: '0.875rem', // Smaller text like captions or annotations
      },
      // Extended shadows for more depth options
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
        medium: '0 6px 15px rgba(0, 0, 0, 0.15)', // Medium shadow for hover states or focus
        hard: '0 10px 25px rgba(0, 0, 0, 0.2)', // Stronger shadow for active states or emphasis
      },
      // Extended border radius values for varied designs
      borderRadius: {
        card: '10px',
        pill: '50px', // Pill shape, suitable for tags or certain buttons
        circle: '50%', // Perfect circle, good for avatars
      },
      // Background Opacity (useful for hover or active states)
      backgroundOpacity: {
        10: '0.1',
        90: '0.9',
      },
      // Extended transition durations
      transitionDuration: {
        fast: '200ms',
        medium: '500ms',
        slow: '1000ms', // Slow transition for certain attention-grabbing animations
      },
      // Additional spacing values
      spacing: {
        18: '4.5rem', // Custom spacing if necessary in designs
      },
      // Potential gradient background utilities
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
