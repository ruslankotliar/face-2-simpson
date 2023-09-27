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
      } border-neutral rounded-card ${
        isDataPredicted ? 'px-12' : 'px-0'
      } hover:border-primary duration-200 cursor-pointer transition-colors h-full w-full`}
    >
      <input
        type='file'
        name={name}
        className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
        accept={accept}
        onChange={handleChangeImage}
      />

      {!previewURL ? (
        <div className='text-center text-neutral h-full flex items-center justify-center'>
          <p className='text-lg md:text-xl mx-2 font-secondary p-6'>
            Upload your picture
          </p>
        </div>
      ) : (
        <div className='md:w-full rounded-card overflow-hidden relative shadow-image'>
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
