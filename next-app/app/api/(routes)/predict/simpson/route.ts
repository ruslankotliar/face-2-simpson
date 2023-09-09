import { NextRequest, NextResponse } from 'next/server';

import { FORM_DATA_KEYS, StatusCodes } from '../../../../_constants';
import { getStatusText } from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const img: File | null = data.get(
      FORM_DATA_KEYS.PREDICTION_IMG
    ) as unknown as File;
    if (!img) throw Error('No image found. Please, try again.');

    const { predict_data: predictionData, predict_time: predictionTime } =
      await predictSimpson(img);

    console.log(predictionData, predictionTime);

    console.log('Waiting for user feedback...');
    return NextResponse.json({
      predictionData,
      predictionTime,
    });
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
