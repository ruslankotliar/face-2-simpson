import Image, { StaticImageData } from 'next/image';
import styles from './styles.module.css';
import { FC } from 'react';
import { akbar } from '@src/app/fonts';
import { capitalizeWord } from '@src/helpers';
import { SimpsonCharacter } from '@src/types';

import homerRunAnimation from '@public/animations/run/homer_simpson.gif';
import bartRunAnimation from '@public/animations/run/bart_simpson.gif';
import lisaRunAnimation from '@public/animations/run/lisa_simpson.gif';
import margeRunAnimation from '@public/animations/run/marge_simpson.gif';
import float2int from '@src/helpers/float2int';

interface ProgressBarProps {
  colorKey: string;
  width: number;
  homerRun: boolean;
  label: SimpsonCharacter;
}

const ProgressBar: FC<ProgressBarProps> = ({
  colorKey,
  width,
  homerRun,
  label,
}) => {
  const icons: Record<SimpsonCharacter, StaticImageData> = {
    homer_simpson: homerRunAnimation,
    marge_simpson: margeRunAnimation,
    bart_simpson: bartRunAnimation,
    lisa_simpson: lisaRunAnimation,
  };
  return (
    <div className={styles['chart']}>
      <h5 className={`${akbar.className} text-caption absolute`}>
        {label
          .split('_')
          .map((w) => capitalizeWord(w))
          .join(' ')}
      </h5>
      <div
        className={`${styles['bar']} ${styles[`bar-${float2int(width)}`]} ${
          styles[colorKey]
        }`}
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
            marginLeft: float2int(width) - 2 + '%',
            transform:
              'translateY(-8.5em) translateZ(5em) rotateX(10deg) rotateY(0deg)',
            transition: 'margin 3s ease-in-out, opacity 1s ease-in-out',
            opacity: homerRun ? 1 : 0,
          }}
        >
          <Image
            alt='Running Homer Simpson animation'
            src={icons[label]}
            fill
            objectFit='contain'
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
