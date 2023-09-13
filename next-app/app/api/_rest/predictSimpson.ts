import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';
import { NextResponse } from 'next/server';

export const predictSimpson = async function (signedKey: string) {
  try {
    const { data } = await axios.post(
      PYTHON_API_ROUTES.PREDICT_SIMPSON,
      signedKey
    );

    return data;
  } catch (e) {
    if (e instanceof Error)
      return NextResponse.json({
        message: e.message,
        cause: e.cause,
        stack: e.stack,
        name: e.name,
      });
    // if (e instanceof Error) throw Error('Error on python server: ' + e.message);
  }
};
