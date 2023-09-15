import { NextResponse } from 'next/server';

import { StatusCodes } from '../../../../../constants';
import { getStatusText } from '../../../../../_utils';
import { signUrl } from '../../../../../_rest';

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
