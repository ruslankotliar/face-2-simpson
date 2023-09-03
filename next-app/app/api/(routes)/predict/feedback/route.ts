import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '../../../../_constants';
import { s3Bucket, getStatusText, connectToDB } from '../../../_utils';
import { ImageCounter, Prediction } from '@app/api/_models';
import { getMaxSimilarChar } from '@app/api/_helpers';

export async function POST(req: NextRequest) {
  try {
    const {
      feedback: userFeedback,
      permission,
      key: imageBucketKey,
      predictData,
      predictTime: predictionTime,
    } = await req.json();
    const characterPredicted = getMaxSimilarChar(predictData);
    console.group('Feedback & Permission');
    console.log(
      'Feedback: ',
      userFeedback
        ? 'positive'
        : userFeedback === null
        ? "don't know"
        : 'negative'
    );
    console.log(
      'Permission to store data: ',
      permission ? 'positive' : 'negative'
    );

    if (permission === false) {
      s3Bucket.deleteObject(imageBucketKey);
    } else {
      await connectToDB();
      await ImageCounter.findByIdAndUpdate(
        {
          _id: characterPredicted,
        },
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(
        'Successfully incremented images counter: ',
        characterPredicted
      );

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
