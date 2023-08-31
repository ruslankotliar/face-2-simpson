'use client';

import axios from 'axios';
import { REQUEST_URL_KEYS } from '@app/_constants';

const retrainModel = async function (): Promise<void> {
  try {
    const { data } = await axios.post(REQUEST_URL_KEYS.RETRAIN_MODEL);

    return data;
  } catch (e) {
    console.error(e);
  }
};

export default function Retrain() {
  return (
    <div>
      <button onClick={async () => await retrainModel()}>Retrain Model</button>
    </div>
  );
}
