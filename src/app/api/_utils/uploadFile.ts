import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { FILE_PATHS } from '../_constants';
import { PREDICT_SIMP_FILENAME } from '@/app/_constants';

export const uploadFile = async function (file: File): Promise<string> {
  console.log(`File name: ${file.name}`);
  console.log(`Content-Length: ${file.size}`);

  const destinationDirPath = FILE_PATHS.UPLOAD;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!existsSync(destinationDirPath)) {
    fs.mkdir(destinationDirPath, { recursive: true });
  }

  const pathname = path.join(
    destinationDirPath,
    `${PREDICT_SIMP_FILENAME}-${uuidv4()}`
  );
  await fs.writeFile(pathname, Buffer.from(buffer));

  return pathname;
};
