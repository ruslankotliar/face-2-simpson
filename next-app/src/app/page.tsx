'use client';
export const revalidate = 0;
/* eslint-disable react-hooks/exhaustive-deps */

import * as Yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';

import SubmitButton from '@src/components/buttons/SubmitButton';
import CheckboxInput from '@src/components/inputs/Checkbox';
import FileInput from '@src/components/inputs/FileInput';
import Loader from '@src/components/misc/Loader';
import Modal from '@src/components/misc/Modal';
import { FORM_CONSTANTS, FORM_KEYS } from '@src/constants';
import { generateFetchURL, isValidFileType } from '@src/helpers';
import {
  FeedbackData,
  PredictSimpsonData,
  PredictInitialValues,
  AlertOptions,
  AlertIconKeys,
} from '@src/types';
import Alert from '@src/components/misc/Alert';

const sendFeedback = async function (
  url: string,
  data: FeedbackData
): Promise<void> {
  try {
    await axios.post(url, data);
  } catch (e) {
    if (e instanceof Error) throw Error(e.message);
  }
};

const predictSimpson = async function (
  personImg: File
): Promise<PredictSimpsonData | undefined> {
  try {
    console.log('Generating presigned url...');
    const {
      data: { key, url },
    } = await axios.post(generateFetchURL('UPLOAD_IMAGE', {}, {}));

    console.log('Uploading image...');
    await axios.put(url, personImg);

    console.log('Requesting prediction...');
    const { data } = await axios.post(
      generateFetchURL('REQUEST_PREDICTION', {}, {}),
      { key }
    );

    return data;
  } catch (e) {
    if (e instanceof Error) throw Error(e.message);
  }
};

const initialValues: PredictInitialValues = {
  personImg: null,
};

const validationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  personImg: Yup.mixed<File>()
    .required('Image is required!')
    .test('fileType', 'Unsupported File Format.', (value) => {
      return isValidFileType(
        value.name && value.name.toLowerCase(),
        FORM_KEYS.PERSON_IMG
      );
    })
    .test(
      'fileSize',
      'File Size is too large.',
      (value: any) =>
        value && value.size <= Number(FORM_CONSTANTS.MAX_PERSON_IMG_SIZE)
    ),
});

export default function Home() {
  const [serverError, setServerError] = useState<string>();
  const [feedbackData, setFeedbackData] = useState<FeedbackData>();
  const [permissionToStore, setPermissionToStore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictSimpsonData>();

  const submitFeedbackToServer = async function (): Promise<void> {
    try {
      if (!feedbackData) return;
      await sendFeedback(
        generateFetchURL('SEND_PREDICTION_FEEDBACK', {}, {}),
        feedbackData
      );
    } catch (e) {
      if (e instanceof Error) setServerError(e.message);
    }
  };

  const handleSubmit = async function ({ personImg }: any) {
    try {
      const data = await predictSimpson(personImg);
      receiveFeedback(data);
    } catch (e) {
      if (e instanceof Error) setServerError(e.message);
    }
  };

  const receiveFeedback = function (
    data: PredictSimpsonData | undefined
  ): void {
    if (!data) return;
    setPredictionData(data);
    setShowModal(true);
  };

  const handleAlertClose = () => {};

  const handleApprove = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: true,
      permissionToStore,
    });
    setShowModal(false);
  };

  const handleDisapprove = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: false,
      permissionToStore,
    });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: null,
      permissionToStore,
    });
    setShowModal(false);
  };

  useEffect(() => {
    submitFeedbackToServer();
  }, [feedbackData]);

  return (
    <>
      <Modal
        show={showModal}
        data={predictionData?.predictionData}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onDisapprove={handleDisapprove}
      />
      <div className='flex items-center justify-center h-full bg-white'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, errors, setFieldError }) => (
            <>
              <Alert
                text={serverError || errors.personImg}
                type={AlertOptions.error}
                iconKey={AlertIconKeys.homerError}
                onAlertClose={(): void => {
                  setFieldError(FORM_KEYS.PERSON_IMG, undefined);
                  setServerError(undefined);
                }}
              />
              {isSubmitting && (
                <Loader
                  width={'200'}
                  height={'200'}
                  wrapperClass={
                    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50'
                  }
                />
              )}
              <Form className='w-full max-w-sm space-y-6'>
                <FileInput
                  name={FORM_KEYS.PERSON_IMG}
                  accept={FORM_CONSTANTS.ACCEPT_PERSON_IMG_EXTENSIONS}
                  setFieldValue={setFieldValue}
                />
                <CheckboxInput
                  label='Data can be stored.'
                  checked={permissionToStore}
                  onChange={setPermissionToStore}
                />
                <SubmitButton />
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
}
