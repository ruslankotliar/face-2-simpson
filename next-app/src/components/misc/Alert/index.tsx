'use client';

import HomerErrorAnimation from '@src/components/animations/HomerError';
import { ALERT_TIMEOUT } from '@src/constants';
import { AlertIconKeys, CustomNotification } from '@src/types';
import { FC, ReactNode, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AlertProps extends CustomNotification {
  onAlertClose: () => void;
  closeOnClick?: boolean;
}

const Alert: FC<AlertProps> = function ({
  content,
  type,
  iconKey,
  onAlertClose,
}) {
  const notify = function () {
    if (!content || !type) return;

    const icons: Record<AlertIconKeys, ReactNode> = {
      homerError: <HomerErrorAnimation />,
    };

    toast[type](content, {
      position: toast.POSITION.TOP_CENTER,
      icon: iconKey ? icons[iconKey] : undefined,
      autoClose: ALERT_TIMEOUT,
    });

    setTimeout(() => {
      onAlertClose();
    }, ALERT_TIMEOUT);
  };

  useEffect(() => {
    content && notify();
  }, [content, type, iconKey]);

  return (
    <div className='absolute'>
      <ToastContainer style={{ width: 'max-content' }} />
    </div>
  );
};

export default Alert;
