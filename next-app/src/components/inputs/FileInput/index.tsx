/* eslint-disable @next/next/no-img-element */
import React, { FC, useRef, useState } from 'react';
import { FormikErrors } from 'formik';

import { DetectFaceData, PredictInitialValues } from '@src/types';
import CloseIcon from '@src/components/icons/Close';
import dynamic from 'next/dynamic';
import Loader from '@src/components/misc/Loader';

const FaceScanner = dynamic(() => import('@src/components/animations/FaceScanner'), {
  ssr: false
});

interface IUploadFile {
  name: string;
  accept: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<PredictInitialValues> | void>;
  setIsVisibleAbout: (value: boolean) => void;
  resetPageData: () => void;
  isDataPredicted: boolean;
  isSubmitting: boolean;
  detectedFaceData?: DetectFaceData;
}

const FileInput: FC<IUploadFile> = function ({
  setFieldValue,
  name,
  accept,
  setIsVisibleAbout,
  resetPageData,
  isSubmitting,
  detectedFaceData,
  isDataPredicted
}) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeImage = function (e: any) {
    setIsLoading(true);
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
    resetPageData();
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div
        ref={imgRef}
        className={`relative ${
          !previewURL ? 'border-2 border-dashed' : ''
        } border-neutral rounded-card hover:border-primary duration-200 cursor-pointer transition-colors flex flex-1 justify-center items-center min-h-0 w-full h-full`}
      >
        <input
          type="file"
          name={name}
          className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
          accept={accept}
          onChange={handleChangeImage}
        />
        {!previewURL ? (
          <div className="text-center text-neutral flex items-center justify-center">
            <p className="text-lg md:text-xl mx-2 font-secondary p-6 py-8">Upload your picture</p>
          </div>
        ) : (
          <div className="relative md:w-full h-fit flex items-center justify-center min-h-[118px]">
            <div
              className={`md:w-full h-auto object-cover rounded-card shadow-image overflow-hidden ${
                isSubmitting ? 'blur-sm' : 'blur-none'
              }`}
            >
              <FaceScanner
                previewURL={previewURL}
                imgRef={imgRef}
                detectedFaceData={detectedFaceData}
                setIsLoading={setIsLoading}
                isDataPredicted={isDataPredicted}
              />
            </div>
            {!isLoading ? (
              <button
                onClick={removeImage}
                className={`absolute top-2 left-2 flex items-center justify-center text-highlight font-bold text-sm md:text-lg focus:outline-none hover:text-primary active:bg-primary-dark`}
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default FileInput;
