import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import {
  BUCKET_KEYS,
  BUCKET_OBJ_TAG_VALUES,
  StatusCodes,
} from '../../../../_constants';
import { getStatusText, s3Bucket } from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';
import { getMaxSimilarChar } from '@app/api/_helpers';
import { BUCKET_OBJ_TAG_KEYS } from '@app/api/_constants';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get(BUCKET_KEYS.TRAIN) as unknown as File;
    if (!file) throw Error('No image found. Please, try again.');

    const key = `${BUCKET_KEYS.TRAIN}/${uuidv4()}`;
    await s3Bucket.putObject(file, key);

    const { predict_data: predictData, predict_time: predictTime } =
      await predictSimpson(key);

    console.log(predictData, predictTime);

    await s3Bucket.putTagging(key, [
      {
        Key: BUCKET_OBJ_TAG_KEYS.CLASS_NAME,
        Value: getMaxSimilarChar(predictData),
      },
      {
        Key: BUCKET_OBJ_TAG_KEYS.PURPOSE,
        Value: BUCKET_OBJ_TAG_VALUES.TRAIN,
      },
    ]);

    console.log('Waiting for user feedback...');
    return NextResponse.json({
      predictData,
      predictTime,
      key,
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
