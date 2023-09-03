import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@app/_constants';
import { StringMap } from '@app/_types';
import { Prediction } from '@app/api/_models';
import { connectToDB, getStatusText } from '@app/api/_utils';

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const granularity: any = 'day'; // let user decide

    let groupId: any = {};
    let dateFromParts: any = {};

    switch (granularity) {
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

    const aggregation = [];

    if (groupId) {
      aggregation.push(
        {
          $group: {
            _id: groupId,
            predictionTime: { $avg: '$predictionTime' },
          },
        },
        {
          $project: {
            _id: 0,
            date: { $dateFromParts: dateFromParts },
            predictionTime: { $round: ['$predictionTime'] },
          },
        }
      );
    } else {
      // For 'all' granularity or default
      aggregation.push(
        {
          $group: {
            _id: null,
            predictionTime: { $avg: '$predictionTime' },
          },
        },
        {
          $project: {
            _id: 0,
            predictionTime: { $round: ['$predictionTime'] },
          },
        }
      );
    }

    const predictionTime = await Prediction.aggregate(aggregation);

    return NextResponse.json({ predictionTime });
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
