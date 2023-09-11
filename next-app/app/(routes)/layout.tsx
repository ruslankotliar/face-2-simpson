import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Predict Simpson',
  description: 'Find out which Simpsons character you are most like',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <header className='bg-black h-16 flex items-center px-10'>
          <nav>
            <ul className='flex space-x-4'>
              <li>
                <Link href={'/'} className='text-white hover:text-gray-400'>
                  Main
                </Link>
              </li>
              <li>
                <Link
                  href={'/dashboard'}
                  className='text-white hover:text-gray-400'
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={'/retrain'}
                  className='text-white hover:text-gray-400'
                >
                  Retrain
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className='min-h-[calc(100vh-4rem)]'>{children}</main>
      </body>
    </html>
  );
}
