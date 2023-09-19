'use client';

import HomerErrorAnimation from '@src/components/animations/HomerError';
import { ALERT_TIMEOUT } from '@src/constants';
import { AlertIconKeys, AlertOptions } from '@src/types';
import { FC, ReactNode, useEffect, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AlertProps {
  text: string | undefined;
  type: AlertOptions;
  iconKey: AlertIconKeys;
  onAlertClose: () => void;
}

const Alert: FC<AlertProps> = function ({ text, type, iconKey, onAlertClose }) {
  const notify = function () {
    const icons: Record<AlertIconKeys, ReactNode> = {
      homerError: <HomerErrorAnimation />,
    };

    toast[type](text, {
      position: toast.POSITION.TOP_CENTER,
      icon: icons[iconKey],
      autoClose: ALERT_TIMEOUT,
    });

    setTimeout(() => {
      onAlertClose();
    }, ALERT_TIMEOUT);
  };

  useEffect(() => {
    text && notify();
  }, [text, type, iconKey]);

  return <ToastContainer />;
};

export default Alert;
