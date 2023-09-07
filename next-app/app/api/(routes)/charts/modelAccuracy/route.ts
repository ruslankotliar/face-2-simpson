import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@app/_constants';
import { Accuracy } from '@app/api/_models';
import { connectToDB, getStatusText } from '@app/api/_utils';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const chartData = await Accuracy.find({}, 'accuracy createdAt -_id').sort({
      createdAt: 1,
    });

    return NextResponse.json({ chartData });
  } catch (e) {
    console.error(e);
    if (e instanceof Error)
      return NextResponse.json(
        { message: e.message },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
        }
      );
  }
}
