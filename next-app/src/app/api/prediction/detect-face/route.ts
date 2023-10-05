import { StatusCodes } from '@src/constants';
import { detectFace } from '@src/rest/detectFace';
import { getStatusText } from '@src/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();

    const { detected_face_data: detectedFaceData } = await detectFace(key);

    return NextResponse.json({ detectedFaceData });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return NextResponse.json(
        { message: e.message },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getStatusText(StatusCodes.INTERNAL_SERVER_ERROR)
        }
      );
    }
  }
}
