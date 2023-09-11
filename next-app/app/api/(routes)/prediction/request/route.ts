import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '../../../../_constants';
import { getStatusText } from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';

export async function POST(req: NextRequest) {
  try {
    const { imgBase64 } = await req.json();

    const {
      predict_data: predictionData,
      predict_time: predictionTime,
      image_bucket_key: imageBucketKey,
    } = await predictSimpson(imgBase64);

    return NextResponse.json({
      predictionData,
      predictionTime,
      imageBucketKey,
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
