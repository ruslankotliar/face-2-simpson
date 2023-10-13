import { FC, ReactNode } from 'react';
import styles from './styles.module.css';

interface SpeechBubbleProps {
  content: string | ReactNode;
}

const SpeechBubble: FC<SpeechBubbleProps> = function ({ content }) {
  return <div className={styles['thought']}>{content}</div>;
};

export default SpeechBubble;
