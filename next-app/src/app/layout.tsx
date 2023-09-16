import './globals.css';
import styles from './styles.module.css';

import type { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import SimpsonsSkyBg from '../../public/images/header-bg.png';

import { akbar, roboto } from './fonts';
import { CLIENT_NAV_KEYS } from '@src/constants';
import NavHomeIcon from '@src/components/icons/NavHome';
import { ReactNode } from 'react';
import NavDashboardIcon from '@src/components/icons/NavDashboard';
import NavGitHubIcon from '@src/components/icons/NavGitHub';

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
      <body className={roboto.className + ' relative'}>
        <MainHeader />
        <main className='min-h-[calc(100vh-5rem)]'>{children}</main>
      </body>
    </html>
  );
}

const MainHeader = function () {
  return (
    <>
      <div className='absolute right-60 top-48 h-fit w-fit z-20'>
        <NavBar />
      </div>

      <header className='bg-black h-20 flex items-center relative w-screen'>
        <Image
          src={SimpsonsSkyBg}
          alt='Header cloud background'
          fill
          style={{ objectFit: 'cover' }}
          className='absolute top-0 left-0 w-full h-full z-10'
        />
        <nav className='px-10 z-20 flex justify-center w-full items-center'>
          <Link href={'/'}>
            <h1
              className={`${akbar.className} font-simpsons text-center text-title`}
            >
              Face-2-Simpson
            </h1>
          </Link>
        </nav>
      </header>
    </>
  );
};

const NavBar = function () {
  const icons: Record<string, ReactNode> = {
    home: <NavHomeIcon />,
    dashboard: <NavDashboardIcon />,
    github: <NavGitHubIcon />,
  };

  return (
    <nav className={styles['nav-list-container']}>
      <ul className={styles['nav-list']}>
        {CLIENT_NAV_KEYS.map(({ path, name, iconKey, newTab }) => (
          <li key={`${path}#${name}`}>
            <Link
              href={path}
              className={styles['list-item']}
              target={newTab ? '_blank' : '_self'}
            >
              {icons[iconKey as keyof typeof icons]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
