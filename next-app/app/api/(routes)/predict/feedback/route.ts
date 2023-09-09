import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import {
  FILENAME_KEYS,
  FORM_DATA_KEYS,
  StatusCodes,
} from '../../../../_constants';
import { s3Bucket, getStatusText, connectToDB } from '../../../_utils';
import { ImageCounter, Prediction } from '@app/api/_models';
import { getMaxSimilarChar } from '@app/api/_helpers';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const predictionResult: string | null = formData.get(
      FORM_DATA_KEYS.PREDICTION_RESULT
    ) as string;
    const img = formData.get(FORM_DATA_KEYS.PREDICTION_IMG) as File;

    if (!predictionResult || !img)
      throw Error('Prediction result or img is missing');

    const { userFeedback, permissionToStore, predictionData, predictionTime } =
      JSON.parse(predictionResult);

    const characterPredicted = getMaxSimilarChar(predictionData);

    if (permissionToStore === true) {
      await connectToDB();
      await ImageCounter.findByIdAndUpdate(
        {
          _id: characterPredicted,
        },
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const imageBucketKey = `${
        FILENAME_KEYS.PURPOSE.TRAIN
      }/${characterPredicted}/${uuidv4()}`;

      await s3Bucket.putObject(img, imageBucketKey);

      await Prediction.create({
        predictionTime,
        characterPredicted,
        imageBucketKey,
        userFeedback,
      });
    }

    return NextResponse.json(null);
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
