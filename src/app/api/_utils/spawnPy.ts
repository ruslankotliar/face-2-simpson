import { spawn } from 'child_process';

import { FILE_PATHS } from '../_constants';

export let spawnPy = (pathname: string): Promise<any> =>
  new Promise(function (success, error) {
    const pyProg = spawn('python3', [FILE_PATHS.PREDICT_MODEL, pathname]);

    console.log('Predicting', pathname, '...');

    pyProg.stdout.on('data', function (data: any) {
      success(data);
    });

    pyProg.stderr.on('data', (data: any) => {
      error(data);
    });
  });
