import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6e42', // orange
        neutral: '#D1D5DB'
      },
      fontSize: {
        xxl: '3rem', // Suitable for main headers
        xl: '2.25rem', // Suitable for sub-headers or large headings
        lg: '1.5rem', // Suitable for smaller headers or emphasized text
        base: '1rem', // Standard size for body text
        sm: '0.875rem', // Suitable for slightly smaller text like captions or footnotes
        xs: '0.75rem' // Suitable for the smallest readable text
      },
      accentColor: {
        orange: '#ff6e42'
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
        medium: '0 6px 15px rgba(0, 0, 0, 0.15)',
        hard: '0 10px 25px rgba(0, 0, 0, 0.2)',
        image: '0px 25px 50px -12px rgba(0, 0, 0, 0.3)',
        'inner-hovered': 'inset 0px 0px 50px 1000px rgba(0,0,0,0.75)',
        'inner-basic': 'inset 0px 0px 15px 5px rgba(0,0,0,0.75)'
      },
      borderRadius: {
        card: '10px',
        pill: '50px',
        circle: '50%'
      },
      backgroundOpacity: {
        10: '0.1',
        90: '0.9'
      },
      transitionDuration: {
        fast: '200ms',
        medium: '500ms',
        slow: '1000ms',
        '3000': '3000ms',
        '0': '0ms'
      },
      spacing: {
        18: '4.5rem'
      },
      backgroundImage: {
        gradientRadial: 'radial-gradient(ellipse at center, var(--tw-gradient-stops))'
      },
      gradientColorStops: {
        start: '#ffed4a',
        end: '#d7385e'
      }
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'translate-z': (value) => ({
            '--tw-translate-z': value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`
          }) // this is actual CSS
        },
        { values: theme('translate'), supportsNegativeValues: true }
      );
    })
  ]
};

export default config;
