import path from 'path';

const PROJECT_PATH = process.cwd();

const FILE_PATHS = {
  UPLOAD: path.join(PROJECT_PATH, 'public/upload'),
  PREDICT_MODEL: path.join(PROJECT_PATH, 'src/app/api/_models/predict/app.py'),
};

export { FILE_PATHS };
