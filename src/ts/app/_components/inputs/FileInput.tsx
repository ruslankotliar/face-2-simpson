import { PredictInitialValues } from '@app/_types';
import { ErrorMessage, FormikErrors } from 'formik';

interface IUploadFile {
  name: string;
  accept: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<PredictInitialValues> | void>;
}

export const FileInput = function ({
  setFieldValue,
  name,
  accept,
}: IUploadFile) {
  return (
    <div>
      <input
        type='file'
        name={name}
        // set supported file types here,
        // could also check again within formik validation or backend
        accept={accept}
        onChange={(e) => {
          // Object is possibly null error w/o check
          if (e.currentTarget.files) {
            setFieldValue(name, e.currentTarget.files[0]);
          }
        }}
      />
      <div className='text-red-500'>
        <ErrorMessage name={name} component='div' />
      </div>
    </div>
  );
};
