import { NextRequest, NextResponse } from 'next/server';

import { PREDICT_SIMP_FILENAME, StatusCodes } from '../../../../_constants';
import { getStatusText, uploadFile } from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const file: File | null = data.get(
      PREDICT_SIMP_FILENAME
    ) as unknown as File;

    if (!file) throw Error('No image found. Please, try again.');

    const key = await uploadFile(file);

    if (!key) throw Error('File upload failed. Key is missing.');

    // send request to model here
    const predictedData = await predictSimpson(key);

    console.log(predictedData);

    return NextResponse.json(predictedData);
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
