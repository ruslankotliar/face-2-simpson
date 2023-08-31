import { StatusCodes } from '@app/_constants';
import { DB_COUNTER_CHARS, ENOUGH_TRAIN_DATA } from '@app/api/_constants';
import { ImageCounter } from '@app/api/_models';
import { connectToDB, getStatusText } from '@app/api/_utils';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await ImageCounter.find({});
    const isEnoughData =
      data.length === DB_COUNTER_CHARS.length &&
      data.every((char) => char.seq >= ENOUGH_TRAIN_DATA);

    if (isEnoughData) {
      await axios.post(process.env.PYTHON_API + '/cron/retrain');
    } else {
      console.log('Not enough data to retrain the model.');
      const state = DB_COUNTER_CHARS.reduce(
        (acc, char) => ({
          ...acc,
          [char]: data.find((c) => c._id === char)?.seq || 'not exist',
        }),
        {}
      );
      console.log('Data: ', state);
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
