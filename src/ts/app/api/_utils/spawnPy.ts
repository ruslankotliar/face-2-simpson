import { FILE_PATHS } from '@api/_constants';
import { spawn } from 'child_process';

export let spawnPy = async (img: string): Promise<any> =>
  new Promise(function (success, error) {
    const pyProg = spawn('python3', [FILE_PATHS.PREDICT_MODEL, img]);

    console.log(`Predicting: ${img}`);

    pyProg.stdout.on('data', function (data: any) {
      success(data);
    });

    pyProg.stderr.on('data', (data: any) => {
      error(data);
    });
  });
