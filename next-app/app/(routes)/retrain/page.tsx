'use client';

import axios from 'axios';
import { REQUEST_URL_KEYS } from '@app/_constants';

const retrainModel = async function (): Promise<void> {
  try {
    const password = prompt('Enter a password to proceed');
    if (
      process.env.NEXT_PUBLIC_RETRAIN_PASSWORD &&
      password !== process.env.NEXT_PUBLIC_RETRAIN_PASSWORD
    ) {
      alert('Access denied');
      return;
    }

    const { data } = await axios.post(REQUEST_URL_KEYS.RETRAIN_MODEL);

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e);
  }
};

export default function Retrain() {
  return (
    <div className='h-screen w-screen flex items-center justify-center bg-white'>
      <button
        onClick={() => retrainModel()}
        className='bg-black text-white px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-white hover:text-black hover:border-black border-2'
      >
        Retrain Model
      </button>
    </div>
  );
}
