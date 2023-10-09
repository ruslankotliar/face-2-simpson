import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@src/constants';
import { Prediction } from '@src/models';
import { connectToDB, getStatusText } from '@src/utils';
import createAggregation from '@src/utils/aggregation';

interface PredictionTimeChartData {
  createdAt: string;
  predictionTime: number;
}

export async function GET(
  _: NextRequest,
  { params: { unit, bin } }: { params: { unit: string; bin: string } }
) {
  try {
    await connectToDB();
    const chartData: Record<string, PredictionTimeChartData[]> = {};

    const { allCharacterPipeline, singleCharacterPipeline } = createAggregation(unit, Number(bin));

    // Aggregate data for all characters together
    chartData['all_characters'] = await Prediction.aggregate(allCharacterPipeline);
    // Aggregate data for each character individually
    const characterAggregatedData = await Prediction.aggregate(singleCharacterPipeline);
    for (const data of characterAggregatedData) {
      chartData[data._id] = data.data;
    }

    // Return the aggregated data for all characters together and for each character individually
    return NextResponse.json({ chartData });
  } catch (e) {
    console.error(e);
    if (e instanceof Error)
      return NextResponse.json(
        { error: e.message },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      );
  }
}
