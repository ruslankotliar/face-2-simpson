import { NextRequest, NextResponse } from 'next/server';

import { PREDICT_SIMP_FILENAME, StatusCodes } from '@app/_constants';
import { getStatusText, uploadFile, spawnPy, unlinkFile } from '@api/_utils';


export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const file: File | null = data.get(
      PREDICT_SIMP_FILENAME
    ) as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: 'No image uploaded. Please, try again.' },
        {
          status: StatusCodes.BAD_REQUEST,
          statusText: getStatusText(StatusCodes.BAD_REQUEST),
        }
      );
    }

    const pathname = await uploadFile(file);

    if (!pathname) throw Error('File upload failed. Pathname is missing.');

    return await spawnPy(pathname)
      .then(function (data) {
        console.log(data.toString());
        return NextResponse.json(data.toString());
      })
      .catch(function (error) {
        console.log(error.toString());
        return NextResponse.json(null, {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      })
      .finally(async function () {
        await unlinkFile(pathname);
      });
  } catch (e) {
    console.error(e);
    return NextResponse.json(null, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
}
