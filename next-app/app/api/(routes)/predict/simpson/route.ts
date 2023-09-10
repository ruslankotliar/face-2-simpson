import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import {
  FILENAME_KEYS,
  FORM_DATA_KEYS,
  StatusCodes,
} from '../../../../_constants';
import { getStatusText, s3Bucket } from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';
import { getMaxSimilarChar } from '@app/api/_helpers';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const img = data.get(FORM_DATA_KEYS.PREDICTION_IMG) as File;
    const imgBase64 = data.get(FORM_DATA_KEYS.PREDICTION_IMG_BASE64) as string;
    if (!img) throw Error('No image found. Please, try again.');

    const { predict_data: predictionData, predict_time: predictionTime } =
      await predictSimpson(imgBase64);

    const characterPredicted = getMaxSimilarChar(predictionData);

    const imageBucketKey = `${
      FILENAME_KEYS.PURPOSE.TRAIN
    }/${characterPredicted}/${uuidv4()}`;

    await s3Bucket.putObject(img, imageBucketKey);

    console.log(predictionData, predictionTime);

    console.log('Waiting for user feedback...');
    return NextResponse.json({
      predictionData,
      predictionTime,
      imageBucketKey,
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
