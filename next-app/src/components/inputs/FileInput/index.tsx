/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from 'react';
import { FormikErrors } from 'formik';

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
  setIsVisibleAbout: (value: boolean) => void;
  isDataPredicted: boolean;
}

const FileInput: FC<IUploadFile> = function ({
  setFieldValue,
  name,
  accept,
  setIsVisibleAbout,
  isDataPredicted,
}) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleChangeImage = function (e: any) {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setFieldValue(name, file);
      setPreviewURL(URL.createObjectURL(file));
      setIsVisibleAbout(false);
    }
    e.currentTarget.files = null;
    e.currentTarget.value = '';
  };

  const removeImage = () => {
    setFieldValue(name, null, false);
    setPreviewURL(null);
    setIsVisibleAbout(true);
  };

  return (
    <div
      className={`relative ${
        !previewURL ? 'border-2 border-dashed' : ''
      } border-neutral rounded-card hover:border-primary duration-200 cursor-pointer transition-colors flex flex-1 justify-center items-stretch min-h-0 w-full h-full`}
    >
      <input
        type='file'
        name={name}
        className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
        accept={accept}
        onChange={handleChangeImage}
      />
      {!previewURL ? (
        <div className='text-center text-neutral flex items-center justify-center'>
          <p className='text-lg md:text-xl mx-2 font-secondary p-6 py-8'>
            Upload your picture
          </p>
        </div>
      ) : (
        <div className='relative md:w-full flex items-center justify-center'>
          <img
            src={previewURL}
            alt='Preview'
            className='h-full md:w-full object-cover rounded-card shadow-image'
          />
          <button
            onClick={removeImage}
            className={`absolute top-2 left-2 flex items-center justify-center text-highlight font-bold text-sm md:text-lg focus:outline-none hover:text-primary active:bg-primary-dark`}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;
