import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import fs from 'fs';
import path from 'path';

import {
  BUCKET_KEYS,
  BUCKET_OBJ_TAG_VALUES,
  StatusCodes,
} from '../../../../_constants';
import { getStatusText, s3Bucket } from '../../../_utils';
import { predictSimpson } from '@app/api/_rest';
import { getMaxSimilarChar } from '@app/api/_helpers';
import { BUCKET_OBJ_TAG_KEYS } from '@app/api/_constants';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const file: File | null = data.get(BUCKET_KEYS.TRAIN) as unknown as File;

    if (!file) throw Error('No image found. Please, try again.');

    const key = `${BUCKET_KEYS.TRAIN}/${uuidv4()}`;

    await s3Bucket.putObject(file, key);

    (async () => {
      // Our starting point
      try {
        // Get the files as an array
        const files = await fs.promises.readdir(
          '/Users/ruslan_kotliar/Downloads/test_dataset/Marge Simpson'
        );

        // Loop them all with the new for...of
        for (const file of files) {
          // Get the full paths
          const fromPath = path.join(
            '/Users/ruslan_kotliar/Downloads/test_dataset/Marge Simpson',
            file
          );

          // Stat the file to see if we have a file or dir
          const stat = await fs.promises.stat(fromPath);

          if (stat.isFile()) {
            const contents = fs.readFile(fromPath, async (err, file) => {
              if (err) {
                console.error(err);
              } else {
                const key = `${BUCKET_KEYS.TEST}/${
                  BUCKET_OBJ_TAG_VALUES.MARGE
                }/${uuidv4()}`;
                await s3Bucket.putObject(file, key, [
                  {
                    Key: BUCKET_OBJ_TAG_KEYS.CLASS_NAME,
                    Value: BUCKET_OBJ_TAG_VALUES.MARGE,
                  },
                  {
                    Key: BUCKET_OBJ_TAG_KEYS.PURPOSE,
                    Value: BUCKET_OBJ_TAG_VALUES.TEST,
                  },
                ]);
              }
            });
          } else if (stat.isDirectory())
            console.log("'%s' is a directory.", fromPath);
        } // End for...of
      } catch (e) {
        // Catch anything bad that happens
        console.error("We've thrown! Whoops!", e);
      }
    })(); // Wrap in parenthesis and call now

    const { predict_data: predictData, predict_time: predictTime } =
      await predictSimpson(key);

    console.log(predictData, predictTime);

    await s3Bucket.putTagging(key, [
      {
        Key: BUCKET_OBJ_TAG_KEYS.CLASS_NAME,
        Value: getMaxSimilarChar(predictData),
      },
      {
        Key: BUCKET_OBJ_TAG_KEYS.PURPOSE,
        Value: BUCKET_OBJ_TAG_VALUES.TRAIN,
      },
    ]);

    return NextResponse.json({
      predictData,
      key,
    });
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
