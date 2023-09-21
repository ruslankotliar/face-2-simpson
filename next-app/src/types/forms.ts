import { ReactNode } from 'react';
import { AlertIconKeys, AlertOptions } from './misc';

// FORMIK INITIAL VALUES
interface PredictInitialValues {
  personImg: File | undefined;
}

interface CustomNotification {
  content?: string | ReactNode;
  type?: AlertOptions;
  iconKey?: AlertIconKeys;
}

export type { PredictInitialValues, CustomNotification };
