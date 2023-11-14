import { NextResponse } from 'next/server';

import { StatusCodes } from '@src/constants';
import { signUrl } from '@src/rest';
import { getStatusText } from '@src/utils';
import sendErrorMessage from '@src/helpers/sendErrorMessage';

export async function POST() {
  try {
    const { url, key } = await signUrl();
    return NextResponse.json({
      url,
      key
    });
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
