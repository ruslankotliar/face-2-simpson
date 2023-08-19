import { NextRequest } from 'next/server';

interface NextApiRequestWithImgCookie extends NextRequest {
  cookie: { 'person-img-pathname': string };
}

export type { NextApiRequestWithImgCookie };
