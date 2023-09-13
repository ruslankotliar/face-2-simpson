import { NextRequest, NextResponse } from 'next/server';

import { predictSimpson } from '@app/api/_rest';
import { StatusCodes } from '../../../../_constants';
import { getStatusText } from '../../../_utils';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    const {
      predict_data: predictionData,
      predict_time: predictionTime,
      image_bucket_key: imageBucketKey,
    } = await predictSimpson(key);

    return NextResponse.json({
      predictionData,
      predictionTime,
      imageBucketKey,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return NextResponse.json(
        {
          message: e.message,
        },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
        }
      );
    }
  }
}
