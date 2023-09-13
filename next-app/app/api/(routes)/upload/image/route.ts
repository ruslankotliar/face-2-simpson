import { NextResponse } from 'next/server';

import { StatusCodes } from '@app/_constants';
import { getStatusText } from '@app/api/_utils';
import { signUrl } from '@app/api/_rest';

export async function POST() {
  try {
    const { url, key } = await signUrl();

    return NextResponse.json({
      url,
      key,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return NextResponse.json(
        { message: e.message },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
        }
      );
    }
  }
}
