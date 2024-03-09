import { NextResponse } from 'next/server';

import { StatusCodes } from '@src/constants';
import { warmup } from '@src/rest';
import { getStatusText } from '@src/utils';
import sendErrorMessage from '@src/helpers/sendErrorMessage';

export async function POST() {
  try {
    await warmup();
    return NextResponse.json({ message: 'Warmup successful' });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { error: sendErrorMessage(e.message) },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      );
    }
  }
}
