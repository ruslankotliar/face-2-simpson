/* eslint-disable react-hooks/exhaustive-deps */
import Image, { StaticImageData } from 'next/image';
import styles from './styles.module.css';
import { FC, useEffect, useState } from 'react';
import { akbar } from '@src/app/fonts';
import { capitalizeWord } from '@src/helpers';
import { SimpsonCharacter } from '@src/types';

import homerRunAnimation from '@public/animations/run/homer_simpson.gif';
import bartRunAnimation from '@public/animations/run/bart_simpson.gif';
import lisaRunAnimation from '@public/animations/run/lisa_simpson.gif';
import margeRunAnimation from '@public/animations/run/marge_simpson.gif';
import float2int from '@src/helpers/float2int';
import formatCharacterName from '@src/helpers/formatCharacterName';

interface ProgressBarProps {
  colorKey: string;
  width: number;
  charactersRun: boolean;
  label: SimpsonCharacter;
}

const ProgressBar: FC<ProgressBarProps> = ({
  colorKey,
  width,
  charactersRun,
  label,
}) => {
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  const [isGreater, setIsGreater] = useState<boolean>(false);

  const icons: Record<SimpsonCharacter, StaticImageData> = {
    homer_simpson: homerRunAnimation,
    marge_simpson: margeRunAnimation,
    bart_simpson: bartRunAnimation,
    lisa_simpson: lisaRunAnimation,
  };

  useEffect(() => {
    setIsGreater(width > currentWidth);
    setCurrentWidth(width);
  }, [width]);

  return (
    <div className={styles['chart']}>
      <h5 className={`${akbar.className} text-caption absolute`}>
        {formatCharacterName(label)}
      </h5>
      <div
        className={`${styles['bar']} ${
          styles[`bar-${float2int(currentWidth)}`]
        } ${styles[colorKey]}`}
      >
        <div className={`${styles['face']} ${styles['top']}`}>
          <div className={styles['growing-bar']}></div>
        </div>
        <div className={`${styles['face']} ${styles['side-0']}`}>
          <div className={styles['growing-bar']}></div>
        </div>
        <div className={`${styles['face']} ${styles['floor']}`}>
          <div className={styles['growing-bar']}></div>
        </div>

        <div className={`${styles['face']} ${styles['side-a']}`}></div>
        <div className={`${styles['face']} ${styles['side-b']}`}></div>
        <div className={`${styles['face']} ${styles['side-1']}`}>
          <div className={styles['growing-bar']}></div>
        </div>
        <div
          style={{
            height: '6rem',
            width: '6rem',
            marginLeft: float2int(currentWidth) - 2 + '%',
            transform:
              'translateY(-8.5em) translateZ(5em) rotateX(10deg) rotateY(0deg)' +
              (isGreater ? ' scale(1, 1)' : ' scale(-1, 1)'),
            transition: 'margin 3s ease-in-out, opacity 1s ease-in-out',
            opacity: charactersRun ? 1 : 0,
          }}
        >
          <Image
            alt='Running Homer Simpson animation'
            src={icons[label]}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
