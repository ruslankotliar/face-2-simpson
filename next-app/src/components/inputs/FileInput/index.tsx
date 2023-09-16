import React, { useState } from 'react';
import { ErrorMessage, FormikErrors } from 'formik';
import Image from 'next/image';
import { PredictInitialValues } from '@src/types';
import CloseIcon from '@src/components/icons/Close';

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
      <div className='relative border-2 border-dashed border-neutral rounded-card p-6 hover:border-primary focus-within:border-highlight transition-medium duration-200 cursor-pointer transform-gpu transition-transform'>
        <input
          type='file'
          name={name}
          className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
          accept={accept}
          onChange={handleChangeImage}
        />

        {!previewURL ? (
          <div className='text-center text-neutral'>
            <p className='text-subtitle font-secondary'>
              Drop It Like It&apos;s Hot
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
              className='absolute top-2 right-2 flex items-center justify-center text-highlight font-bold text-lg focus:outline-none hover:text-primary active:bg-primary-dark'
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>
      <div className='text-tertiary'>
        <ErrorMessage name={name} component='div' />
      </div>
    </div>
  );
};

export default FileInput;
