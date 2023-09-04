import { StatusCodes } from '@app/_constants';
import { DB_COUNTER_CHARS, ENOUGH_TRAIN_DATA } from '@app/api/_constants';
import { Accuracy, ImageCounter } from '@app/api/_models';
import { retrainModel } from '@app/api/_rest';
import { connectToDB, getStatusText } from '@app/api/_utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await ImageCounter.find({});
    const isEnoughData =
      data.length === DB_COUNTER_CHARS.length &&
      data.every((char) => char.seq >= ENOUGH_TRAIN_DATA);
    const minQuantity = Math.min(...data.map((char) => char.seq));

    const { accuracy: oldAccuracy } = await Accuracy.findOne(
      {},
      {},
      {
        sort: { createdAt: -1 },
      }
    );

    if (isEnoughData) {
      const { model_accuracy: accuracy } = await retrainModel(
        minQuantity,
        oldAccuracy
      );
      accuracy > oldAccuracy && (await Accuracy.create({ accuracy }));
    } else {
      console.group('Not enough data to retrain the model');
      DB_COUNTER_CHARS.forEach((char) =>
        console.log(char, data.find((c) => c._id === char)?.seq || 'not exist')
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
