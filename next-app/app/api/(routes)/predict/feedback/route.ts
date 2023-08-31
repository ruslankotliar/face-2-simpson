import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '../../../../_constants';
import { s3Bucket, getStatusText, connectToDB } from '../../../_utils';
import { ImageCounter } from '@app/api/_models';
import { getMaxSimilarChar } from '@app/api/_helpers';

export async function POST(req: NextRequest) {
  try {
    const { feedback, permission, key, predictData } = await req.json();

    console.log('Feedback: ', feedback ? 'positive' : 'negative');
    console.log(
      'Permission to store files: ',
      feedback ? 'positive' : 'negative'
    );

    if (permission === false) {
      s3Bucket.deleteObject(key);
    } else {
      await connectToDB();
      await ImageCounter.findByIdAndUpdate(
        {
          _id: getMaxSimilarChar(predictData),
        },
        { $inc: { seq: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(
        'Successfully incremented images counter: ',
        getMaxSimilarChar(predictData)
      );
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
