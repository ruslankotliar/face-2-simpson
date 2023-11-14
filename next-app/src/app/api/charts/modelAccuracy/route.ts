import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@src/constants';
import { Accuracy } from '@src/models';
import { connectToDB, getStatusText } from '@src/utils';
import sendErrorMessage from '@src/helpers/sendErrorMessage';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const chartData = await Accuracy.find({}, 'accuracy createdAt -_id').sort({
      createdAt: 1
    });

    return NextResponse.json({ chartData });
  } catch (e) {
    console.error(e);
    if (e instanceof Error)
      return NextResponse.json(
        { error: sendErrorMessage(e.message) },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      );
  }
}
