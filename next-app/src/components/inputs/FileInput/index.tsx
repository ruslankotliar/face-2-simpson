/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { FormikErrors } from 'formik';
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
    setFieldValue(name, null, false);
    setPreviewURL(null);
  };

  return (
    <div
      className={`relative ${
        !previewURL ? 'border-2 border-dashed' : ''
      } border-neutral rounded-card p-6 hover:border-primary duration-200 cursor-pointer transition-colors h-fit w-full`}
    >
      <input
        type='file'
        name={name}
        className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
        accept={accept}
        onChange={handleChangeImage}
      />

      {!previewURL ? (
        <div className='text-center text-neutral'>
          <p className='text-subtitle font-secondary'>Upload your picture</p>
        </div>
      ) : (
        <div className='w-full rounded-card overflow-hidden relative shadow-image'>
          <img src={previewURL} alt='Preview' className='w-full h-fit' />
          <button
            onClick={removeImage}
            className='absolute top-2 right-2 flex items-center justify-center text-highlight font-bold text-lg focus:outline-none hover:text-primary active:bg-primary-dark'
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;
