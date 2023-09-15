import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@src/constants';
import { Prediction } from '@src/models';
import { connectToDB, getStatusText } from '@src/utils';

interface PredictionTimeChartData {
  createdAt: string;
  predictionTime: number;
}

export async function GET(
  _: NextRequest,
  { params: { unit } }: { params: { unit: string } }
) {
  try {
    await connectToDB();

    let groupId: any = {};
    let dateFromParts: any = {};

    switch (unit) {
      default:
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
    }

    const chartData: Record<string, PredictionTimeChartData[]> = {};

    // Aggregate data for all characters together
    chartData['all_characters'] = await Prediction.aggregate([
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
      { $sort: { createdAt: 1 } },
    ]);

    const characterAggregatedData = await Prediction.aggregate([
      {
        $group: {
          _id: {
            ...groupId,
            character: '$characterPredicted',
          },
          predictionTime: { $avg: '$predictionTime' },
        },
      },
      {
        $project: {
          _id: 0,
          character: '$_id.character',
          createdAt: { $dateFromParts: dateFromParts },
          predictionTime: { $round: ['$predictionTime'] },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$character',
          data: {
            $push: {
              createdAt: '$createdAt',
              predictionTime: '$predictionTime',
            },
          },
        },
      },
    ]);

    for (const data of characterAggregatedData) {
      chartData[data._id] = data.data;
    }

    // Return the aggregated data for all characters together and for each character individually
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
