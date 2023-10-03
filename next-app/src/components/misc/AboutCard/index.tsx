'use client';

import { useRef, MouseEvent, useState, FC, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Constants

// Styles
import styles from './styles.module.css';

// Icons
import NavGitHubIcon from '@src/components/icons/NavGitHub';
import NavLinkedInIcon from '@src/components/icons/NavLinkedIn';
import PortfolioIcon from '@src/components/icons/Portfolio';
import EmailIcon from '@src/components/icons/Email';

// Types
import { DeveloperData } from '@src/types';

interface AboutCardProps {
  dev: DeveloperData;
}

const AboutCard: FC<AboutCardProps> = ({ dev: { img, buttons, name, area, position } }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerCardRef = useRef<HTMLSpanElement | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [glareCoords, setGlareCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [perspective, setPerspective] = useState<number>(0);
  const [angleCoords, setAngleCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [calcShadowCoords, setCalcShadowCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const [dropShadowColor, setDropShadowColor] = useState<string>('rgba(0, 0, 0, 0.3)');

  const icons: Record<string, ReactNode> = {
    email: <EmailIcon />,
    github: <NavGitHubIcon />,
    linkedin: <NavLinkedInIcon />,
    portfolio: <PortfolioIcon />
  };

  const calculateAngle = (e: MouseEvent) => {
    const attr = cardRef.current?.getAttribute('data-filter-color');
    setDropShadowColor(attr || dropShadowColor);

    setIsHovered(true);

    // Get the x position of the users mouse, relative to the button itself
    const innerCard = innerCardRef.current;
    if (!innerCard) return;

    let x = Math.abs(innerCard.getBoundingClientRect().x - e.clientX);
    // Get the y position relative to the button
    let y = Math.abs(innerCard.getBoundingClientRect().y - e.clientY);

    // Calculate half the width and height
    let halfWidth = innerCard.getBoundingClientRect().width / 2;
    let halfHeight = innerCard.getBoundingClientRect().height / 2;

    // Use this to create an angle. I have divided by 6 and 4 respectively so the effect looks good.
    // Changing these numbers will change the depth of the effect.
    let calcAngleX = (x - halfWidth) / 6;
    let calcAngleY = (y - halfHeight) / 14;

    let gX = (1 - x / (halfWidth * 2)) * 100;
    let gY = (1 - y / (halfHeight * 2)) * 100;

    // Add the glare at the reflection of where the user's mouse is hovering
    setGlareCoords({ x: gX, y: gY });

    // And set its container's perspective.
    setPerspective(halfWidth * 6);

    // Set the items transform CSS property
    setAngleCoords({ x: calcAngleX, y: calcAngleY });

    // Reapply this to the shadow, with different dividers
    let calcShadowX = (x - halfWidth) / 3;
    let calcShadowY = (y - halfHeight) / 6;

    // Add a filter shadow - this is more performant to animate than a regular box shadow.
    setCalcShadowCoords({ x: calcShadowX, y: calcShadowY });
    setDropShadowColor(dropShadowColor);
  };

  const handleMouseEnter = (e: MouseEvent) => {
    calculateAngle(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    calculateAngle(e);
  };

  const handleMouseLeave = () => {
    const attr = cardRef.current?.getAttribute('data-filter-color');
    setDropShadowColor(attr || dropShadowColor);
    setIsHovered(false);
  };

  return (
    <div
      className={`${styles['card']} ${styles['blastoise']} ${isFlipped ? styles['flipped'] : ''}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: cardRef.current?.getAttribute('data-custom-perspective') || `${perspective}px`
      }}
    >
      <span
        className={styles['inner-card-backface']}
        style={{
          transform: isHovered
            ? `rotateY(${
                angleCoords.x
              }deg) rotateX(${-angleCoords.y}deg) scale(1.04) translateZ(-4px)`
            : 'rotateY(0deg) rotateX(0deg) scale(1.01) translateZ(-4px)'
        }}
      >
        <span className={styles['flip-inner-card']}>
          <h3>Responsibilities</h3>
          <span onClick={() => setIsFlipped(false)} className={styles['unflip']}>
            Unflip
          </span>
          <ul className="ml-4 mt-2">
            {area.map((a) => (
              <li key={a} className={styles['area-list-item']}>
                {a}
              </li>
            ))}
          </ul>
        </span>
      </span>
      <span
        className={`${styles['inner-card']} ${isHovered ? styles['animated'] : ''}`}
        ref={innerCardRef}
        style={{
          perspective: `${perspective}px`,
          transform: isHovered
            ? `rotateY(${angleCoords.x}deg) rotateX(${-angleCoords.y}deg) scale(1.04)`
            : 'rotateY(0deg) rotateX(0deg) scale(1)',
          filter: isHovered
            ? `drop-shadow(${-calcShadowCoords.x}px ${-calcShadowCoords.y}px 15px ${dropShadowColor})`
            : `drop-shadow(0 10px 15px ${dropShadowColor})`
        }}
      >
        <span className={styles['user-details']}>
          <span className={styles['top-section']}>
            <span onClick={() => setIsFlipped(true)} className={styles['flip']}>
              Flip
            </span>
          </span>
          <span className={styles['bottom-section']}>
            <span className={styles['name']}>{name}</span>
            <span className={styles['area']}>
              <span className={styles['area-container']}>{position}</span>
            </span>
            <ul className={styles['buttons']}>
              {buttons.map(({ href, iconKey, newTab }) => (
                <li key={`${iconKey}#${href}#${newTab}`}>
                  <Link href={href} target={newTab ? '_blank' : '_self'}>
                    {icons[iconKey as keyof typeof icons]}
                  </Link>
                </li>
              ))}
            </ul>
          </span>
        </span>
        <span className={styles['user-icon']}>
          <Image
            src={img}
            alt="Avatar Ruslan Kotliarenko"
            height={128}
            width={128}
            style={{ objectFit: 'contain' }}
            className="z-10"
          />
        </span>
        <span
          className={styles['glare']}
          style={{
            background: `radial-gradient(circle at ${glareCoords.x}% ${glareCoords.y}%, rgb(199 198 243), transparent)`
          }}
        ></span>
      </span>
    </div>
  );
};

export default AboutCard;
