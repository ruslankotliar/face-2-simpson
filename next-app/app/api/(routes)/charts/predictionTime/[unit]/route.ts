import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@app/_constants';
import { Prediction } from '@app/api/_models';
import { connectToDB, getStatusText } from '@app/api/_utils';

export async function GET(
  req: NextRequest,
  { params: { unit } }: { params: { unit: string } }
) {
  try {
    await connectToDB();

    let groupId: any = {};
    let dateFromParts: any = {};

    switch (unit) {
      case 'day':
        groupId = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        };
        dateFromParts = {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
        };
        break;

      case 'month':
        groupId = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        };
        dateFromParts = {
          year: '$_id.year',
          month: '$_id.month',
        };
        break;

      case 'year':
        groupId = {
          year: { $year: '$createdAt' },
        };
        dateFromParts = {
          year: '$_id.year',
        };
        break;

      case 'all':
      default:
        groupId = null;
        dateFromParts = null;
        break;
    }

    let chartData = [];

    if (groupId) {
      chartData = await Prediction.aggregate([
        {
          $group: {
            _id: groupId,
            predictionTime: { $avg: '$predictionTime' },
          },
        },
        {
          $project: {
            _id: 0,
            createdAt: { $dateFromParts: dateFromParts },
            predictionTime: { $round: ['$predictionTime'] },
          },
        },
      ]);
    } else {
      // For 'all' unit or default
      chartData = await Prediction.find({}, '-_id predictionTime createdAt');
    }

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
