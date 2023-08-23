import { NextRequest, NextResponse } from 'next/server';

import { PREDICT_SIMP_FILENAME, StatusCodes } from '../../../../_constants';
import {
  getStatusText,
  setBucketObjectTag,
  putBucketObject,
} from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';
import { getMaxSimilarChar } from '@app/api/_helpers';
import { AWS_S3_TAGS } from '@app/api/_constants';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const file: File | null = data.get(
      PREDICT_SIMP_FILENAME
    ) as unknown as File;

    if (!file) throw Error('No image found. Please, try again.');

    const key = await putBucketObject(file);

    if (!key) throw Error('File upload failed. Key is missing.');

    // send request to model here
    const { predict_data: predictData, predict_time: predictTime } =
      await predictSimpson(key);

    console.log(predictData, predictTime);

    await setBucketObjectTag(
      key,
      AWS_S3_TAGS.CLASS_NAME,
      getMaxSimilarChar(predictData)
    );

    return NextResponse.json({
      predictData,
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
