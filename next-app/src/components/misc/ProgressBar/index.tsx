/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';

import styles from './styles.module.css';

import { akbar, roboto } from '@src/app/fonts';
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
  isVisible: boolean;
  delay: number;
}

const ProgressBar: FC<ProgressBarProps> = ({
  colorKey,
  width,
  charactersRun,
  label,
  isVisible,
  delay,
}) => {
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  const [isGreater, setIsGreater] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number>(0);

  const icons: Record<SimpsonCharacter, StaticImageData> = {
    homer_simpson: homerRunAnimation,
    marge_simpson: margeRunAnimation,
    bart_simpson: bartRunAnimation,
    lisa_simpson: lisaRunAnimation,
  };

  const updateAccuracyInterval = function () {
    const interval = setInterval(() => {
      if (accuracy < width) {
        setAccuracy((prev) => Math.min(prev + 0.1, width));
      } else if (accuracy > width) {
        setAccuracy((prev) => Math.max(prev - 0.1, width));
      } else {
        setAccuracy((prev) => float2int(prev));
        clearInterval(interval); // Clear interval when accuracy matches width
      }
    }, 1);

    return interval; // Return interval ID for external clearance if needed
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isVisible) {
      intervalId = updateAccuracyInterval();
    } else if (width === 0) {
      setAccuracy(0);
    }

    return () => clearInterval(intervalId); // Cleanup on unmount or when dependencies change
  }, [isVisible, width]);

  useEffect(() => {
    setIsGreater(width >= currentWidth);
    setCurrentWidth(width);
    console.log(width);
  }, [width]);

  return (
    <div className={styles['chart']}>
      <div className='w-full flex justify-between items-center absolute text-caption'>
        <h5
          className={`${akbar.className} ${
            isVisible
              ? 'translate-x-0 opacity-1'
              : '-translate-x-full opacity-0'
          } transform transition-all duration-150`}
          style={{ transitionDelay: delay + 'ms' }}
        >
          {formatCharacterName(label)}
        </h5>
        <span
          className={`${roboto.className} ${
            isVisible ? 'opacity-1' : 'opacity-0'
          } transition-opacity duration-200`}
        >
          {accuracy !== width ? accuracy.toFixed(1) : width}%
        </span>
      </div>
      <div
        className={`${styles['bar']} ${
          styles[`bar-${isVisible ? currentWidth : 0}`]
        } ${styles[colorKey]}`}
      >
        {['top', 'side-0', 'floor'].map((side) => (
          <div key={side} className={`${styles['face']} ${styles[side]}`}>
            <div
              className={`${styles['growing-bar']} ${
                width !== 0 ? 'duration-3000' : 'duration-0'
              }`}
            ></div>
          </div>
        ))}

        {['side-a', 'side-b'].map((side) => (
          <div key={side} className={`${styles['face']} ${styles[side]}`}></div>
        ))}

        <div className={`${styles['face']} ${styles['side-1']}`}>
          <div
            className={`${styles['growing-bar']} ${
              width !== 0 ? 'duration-3000' : 'duration-300'
            }`}
          ></div>
        </div>
        <div
          style={{
            position: 'absolute',
            height: '6rem',
            width: '6rem',
            marginLeft: isVisible ? currentWidth + '%' : 0,
            transform:
              'translateY(-8.5em) translateZ(5em) rotateX(10deg) rotateY(0deg)' +
              (isGreater ? ' scaleX(1)' : ' scaleX(-1)'),
            transition: `margin-left ${
              width !== 0 ? '3s' : '0s'
            } ease-in-out, opacity 500ms ease-in-out`,
            opacity: isVisible && charactersRun ? 1 : 0,
          }}
        >
          <Image
            alt='Running Homer Simpson animation'
            src={icons[label]}
            fill
            style={{ objectFit: 'contain' }}
            sizes='6rem 6rem'
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
