import React, { useState } from 'react';

import { ErrorMessage, FormikErrors } from 'formik';
import Image from 'next/image';
import { PredictInitialValues } from '@src/types';

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

  const handleChangeImage = function (e: any) {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setFieldValue(name, file);
      setPreviewURL(URL.createObjectURL(file));
    }
    e.currentTarget.files = null;
    e.currentTarget.value = '';
  };

  const removeImage = () => {
    setFieldValue(name, undefined);
    setPreviewURL(null);
  };

  return (
    <div className='space-y-6 z-5'>
      <div className='relative border-2 border-dashed border-secondary rounded-card p-6 hover:border-primary transition-medium duration-200 cursor-pointer'>
        <input
          type='file'
          name={name}
          className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer hover:bg-secondary hover:bg-opacity-20 focus:bg-opacity-20 transition-medium duration-200'
          accept={accept}
          onChange={handleChangeImage}
        />
        {!previewURL ? (
          <div className='text-center text-neutral'>
            <p className='text-subtitle font-secondary'>
              Click or drag to upload an image
            </p>
          </div>
        ) : (
          <div className='w-full h-40 rounded-card overflow-hidden relative'>
            <Image
              src={previewURL}
              alt='Preview'
              fill
              style={{ objectFit: 'contain' }}
            />
            <button
              onClick={removeImage}
              className='absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-highlight text-white font-bold text-lg focus:outline-none hover:bg-primary active:bg-primary-dark transition-all duration-300 shadow-soft hover:shadow-medium rounded-full'
              style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
            >
              ×
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
