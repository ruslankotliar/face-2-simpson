import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '../../../../constants';
import { Prediction } from '../../../../models';
import { connectToDB, getStatusText } from '../../../../utils';

export async function GET() {
  try {
    await connectToDB();

    const chartData = await Prediction.aggregate([
      {
        $group: {
          _id: '$characterPredicted',
          count: { $sum: 1 },
        },
      },
    ]);

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
