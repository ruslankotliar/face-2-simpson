import Image from 'next/image';
import styles from './styles.module.css';
import { FC, useEffect } from 'react';
import homerRunAnimation from '../../../../public/animations/homer-run.gif';

interface ProgressBarProps {
  colorKey: string;
  width: number;
  homerRun: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({ colorKey, width, homerRun }) => {
  useEffect(() => {
    console.log(homerRun);
  }, [homerRun]);
  return (
    <div className={styles['chart']}>
      <div
        className={`${styles['bar']} ${styles[`bar-${width}`]} ${
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
            height: '4rem',
            width: '4rem',
            marginLeft: width + '%',
            transform: 'translateX(-1rem) translateY(-10em) translateZ(3em)',
            transition: 'all 4s ease-in-out',
            opacity: homerRun ? 1 : 0,
          }}
        >
          <Image
            alt='Running Homer Simpson animation'
            src={homerRunAnimation}
            fill
            objectFit='contain'
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
