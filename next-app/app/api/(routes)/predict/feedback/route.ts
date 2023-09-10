import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '../../../../_constants';
import { getStatusText, connectToDB } from '../../../_utils';
import { ImageCounter, Prediction } from '@app/api/_models';
import { getMaxSimilarChar } from '@app/api/_helpers';

export async function POST(req: NextRequest) {
  try {
    const {
      userFeedback,
      permissionToStore,
      predictionData,
      predictionTime,
      imageBucketKey,
    } = await req.json();

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
