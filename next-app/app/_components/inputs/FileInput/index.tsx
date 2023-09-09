import React, { useState } from 'react';
import { PredictInitialValues } from '../../../_types';
import { ErrorMessage, FormikErrors } from 'formik';
import Image from 'next/image';

interface IUploadFile {
  name: string;
  accept: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<PredictInitialValues> | void>;
}

const FileInput = function ({ setFieldValue, name, accept }: IUploadFile) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const removeImage = () => {
    setFieldValue(name, undefined);
    setPreviewURL(null);
  };

  return (
    <div className='space-y-4 z-5'>
      <div className='relative border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-all duration-200 cursor-pointer'>
        <input
          type='file'
          name={name}
          className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
          accept={accept}
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];

            if (file) {
              setFieldValue(name, file);
              setPreviewURL(URL.createObjectURL(file));
            }

            e.currentTarget.files = null;
            e.currentTarget.value = '';
          }}
        />
        {!previewURL ? (
          <div className='text-center text-gray-600'>
            <p>Click or drag to upload an image</p>
          </div>
        ) : (
          <div className='w-full h-40 rounded-md overflow-hidden relative'>
            <Image
              src={previewURL}
              alt='Preview'
              fill
              style={{ objectFit: 'cover' }}
            />
            <button
              className='absolute top-2 right-2 bg-red-600 text-white px-2 focus:outline-none hover:bg-red-700 transition-all duration-200 rounded-full'
              onClick={removeImage}
            >
              x
            </button>
          </div>
        )}
      </div>

      <div className='text-red-500'>
        <ErrorMessage name={name} component='div' />
      </div>
    </div>
  );
};

export default FileInput;
