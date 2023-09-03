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

    if (isEnoughData) {
      const { model_accuracy: modelAccuracy } = await retrainModel(
        Math.min(...data.map((char) => char.seq))
      );
      await Accuracy.create({ modelAccuracy });
      console.log('Model accuracy: ', modelAccuracy);
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
