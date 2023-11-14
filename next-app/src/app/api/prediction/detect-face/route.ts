// import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

import { StatusCodes } from '@src/constants';
import { detectFace } from '@src/rest/detectFace';
import { getStatusText } from '@src/utils';
import sendErrorMessage from '@src/helpers/sendErrorMessage';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    const { detected_face_data: detectedFaceData } = await detectFace(key);

    // fs.writeFile(
    //   '/Users/ruslan_kotliar/Coding/code_projects/face-2-simpson/next-app/public/data.json',
    //   JSON.stringify(detectedFaceData),
    //   {},
    //   () => console.log('done')
    // );

    return NextResponse.json({ detectedFaceData });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return NextResponse.json(
        { error: sendErrorMessage(e.message) },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      );
    }
  }
}
