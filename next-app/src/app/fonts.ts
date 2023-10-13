import { Roboto } from 'next/font/google';
import localFont from 'next/font/local';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const akbar = localFont({
  src: '../../public/fonts/akbar.ttf',
  display: 'swap',
});

export { akbar, roboto };
