'use client';
export const revalidate = 0;
/* eslint-disable react-hooks/exhaustive-deps */

import * as Yup from 'yup';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';

import SubmitButton from '@src/components/buttons/SubmitButton';
import CheckboxInput from '@src/components/inputs/Checkbox';
import FileInput from '@src/components/inputs/FileInput';
import Loader from '@src/components/misc/Loader';
import Modal from '@src/components/misc/Modal';
import {
  DEFAULT_PREDICTION_DATA,
  FORM_CONSTANTS,
  FORM_KEYS,
  HOMER_RUN_TIMEOUT,
  PROGRESS_BAR_COLORS,
} from '@src/constants';
import { generateFetchURL, isValidFileType } from '@src/helpers';
import {
  FeedbackData,
  PredictSimpsonData,
  PredictInitialValues,
  AlertOptions,
  AlertIconKeys,
  SimpsonCharacter,
} from '@src/types';
import Alert from '@src/components/misc/Alert';
import ProgressBar from '@src/components/misc/ProgressBar';

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
  personImg: undefined,
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
  const [homerRun, setHomerRun] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>();
  const [feedbackData, setFeedbackData] = useState<FeedbackData>();
  const [permissionToStore, setPermissionToStore] = useState(true);
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

  const handleSubmit = async function ({ personImg }: PredictInitialValues) {
    try {
      receiveFeedback({
        predictionData: {
          homer_simpson: 70,
          marge_simpson: 80,
          bart_simpson: 30,
          lisa_simpson: 25,
        },
        predictionTime: 0.5,
        imageBucketKey: '',
      });

      if (!personImg) {
        setServerError('Image is required!');
        return;
      }

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
    setHomerRun(true);
    setTimeout(() => {
      setHomerRun(false);
    }, HOMER_RUN_TIMEOUT);
  };

  const handleApprove = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: true,
      permissionToStore,
    });
  };

  const handleDisapprove = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: false,
      permissionToStore,
    });
  };

  const handleCloseModal = () => {
    if (!predictionData) return;
    setFeedbackData({
      ...predictionData,
      userFeedback: null,
      permissionToStore,
    });
  };

  useEffect(() => {
    submitFeedbackToServer();
  }, [feedbackData]);

  return (
    <>
      {/* <Modal
        data={predictionData?.predictionData}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onDisapprove={handleDisapprove}
      /> */}
      <div className='flex items-center justify-between h-full bg-grey gap-6'>
        <div className='basis-2/3 flex justify-center items-center'>
          <FileInputForm
            handleSubmit={handleSubmit}
            serverError={serverError}
            setServerError={setServerError}
            permissionToStore={permissionToStore}
            setPermissionToStore={setPermissionToStore}
          />
        </div>
        <div className='basis-1/2'>
          <div>
            {Object.entries(
              predictionData?.predictionData || DEFAULT_PREDICTION_DATA
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, value], index) => (
                <>
                  <ProgressBar
                    label={key as SimpsonCharacter}
                    key={index}
                    colorKey={PROGRESS_BAR_COLORS[index]}
                    width={value}
                    homerRun={homerRun}
                  />
                </>
              ))}
          </div>
        </div>
        <div className='basis-2/3'></div>
      </div>
    </>
  );
}

interface FileInputFormProps {
  handleSubmit: (values: PredictInitialValues) => void;
  serverError?: string;
  setServerError: (error: string | undefined) => void;
  permissionToStore: boolean;
  setPermissionToStore: (permission: boolean) => void;
}

const FileInputForm: FC<FileInputFormProps> = ({
  handleSubmit,
  serverError,
  setServerError,
  permissionToStore,
  setPermissionToStore,
}) => (
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
);
