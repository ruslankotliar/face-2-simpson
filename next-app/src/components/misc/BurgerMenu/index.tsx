'use client';

import { CLIENT_NAV_KEYS } from '@src/constants';
import styles from './styles.module.css';

import React, { CSSProperties, ReactNode, useState } from 'react';
import Link from 'next/link';
import NavHomeIcon from '@src/components/icons/NavHome';
import NavDashboardIcon from '@src/components/icons/NavDashboard';
import NavGitHubIcon from '@src/components/icons/NavGitHub';
import { usePathname } from 'next/navigation';

const BurgerMenu = function () {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSetOpen = () => setIsOpen((value) => !value);

  const icons: Record<string, ReactNode> = {
    home: <NavHomeIcon />,
    dashboard: <NavDashboardIcon />,
    github: <NavGitHubIcon />,
  };

  return (
    <>
      <div
        className={`flex items-center justify-center absolute right-0 top-0 bg-blue-50 transform transition-all duration-500 origin-top-right overflow-hidden ${
          isOpen
            ? 'translate-x-0 translate-y-0 h-screen w-screen opacity-1'
            : 'translate-x-full -translate-y-full h-0 w-0 opacity-0'
        }`}
      >
        <nav>
          <ul className='flex flex-col gap-4'>
            {CLIENT_NAV_KEYS.map(({ name, path, newTab, iconKey }) => (
              <li key={`${name}#${path}#${newTab}}`} className='w-fit h-fit'>
                <Link
                  onClick={handleSetOpen}
                  href={path}
                  target={newTab ? '_blank' : '_self'}
                  className='flex justify-between items-center gap-2 text-2xl text-center'
                >
                  <div
                    className={`${
                      pathname === path ? 'text-primary' : 'text-black'
                    }`}
                  >
                    {icons[iconKey as keyof typeof icons]}
                  </div>
                  <div>
                    <span>{name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        onClick={handleSetOpen}
        className={`flex items-center justify-center ${
          isOpen ? 'text-primary' : 'text-black'
        }`}
      >
        <input
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
          type='checkbox'
          role='button'
          aria-label='Display the menu'
          style={{ '--c': isOpen ? '#ff6e42' : 'black' } as CSSProperties}
          className={styles['menu']}
        />
      </div>
    </>
  );
};

export default BurgerMenu;
