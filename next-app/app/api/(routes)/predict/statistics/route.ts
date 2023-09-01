import { requestStatistics } from '@app/api/_rest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const data = await requestStatistics();

  console.log(data);

  return NextResponse.json(null);
}
