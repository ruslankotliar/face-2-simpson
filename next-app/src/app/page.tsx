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

import {
  ASK_FEEDBACK_TIMEOUT,
  DEFAULT_PREDICTION_DATA,
  DISPLAY_SPEECH_BUBBLE_TIMEOUT,
  FORM_CONSTANTS,
  FORM_KEYS,
  HOMER_RUN_TIMEOUT,
  PROGRESS_BAR_COLORS,
  SET_DEFAULT_USER_FEEDBACK,
} from '@src/constants';
import {
  generateFetchURL,
  getMaxSimilarChar,
  isValidFileType,
} from '@src/helpers';
import {
  FeedbackData,
  PredictSimpsonData,
  PredictInitialValues,
  AlertOptions,
  AlertIconKeys,
  SimpsonCharacter,
  CustomNotification,
} from '@src/types';
import Alert from '@src/components/misc/Alert';
import ProgressBar from '@src/components/misc/ProgressBar';
import LikeButton from '@src/components/buttons/LikeButton';
import SpeechBubble from '@src/components/misc/SpeechBubble';
import DislikeButton from '@src/components/buttons/DislikeButton';

const sendFeedback = async function (
  url: string,
  data: FeedbackData
): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
    });

    // await axios.post(url, data);
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
  const [charactersRun, setCharactersRun] = useState<boolean>(false);
  const [displaySpeechBubble, setDisplaySpeechBubble] =
    useState<boolean>(false);
  const [notification, setNotification] = useState<CustomNotification>();
  const [userFeedback, setUserFeedback] = useState<boolean | null>();
  const [permissionToStore, setPermissionToStore] = useState(true);
  const [predictionData, setPredictionData] = useState<PredictSimpsonData>();

  const submitFeedbackToServer = async function (
    data: PredictSimpsonData | undefined = predictionData,
    feedback: boolean | null | undefined = userFeedback
  ): Promise<void> {
    try {
      console.log(data, feedback);
      if (!data || feedback === undefined) return;
      console.log('sending user feedback', feedback);

      await sendFeedback(generateFetchURL('SEND_PREDICTION_FEEDBACK', {}, {}), {
        userFeedback: feedback,
        permissionToStore,
        ...data,
      });

      setUserFeedback(undefined);
    } catch (e) {
      if (e instanceof Error)
        setNotification({
          content: e.message,
          type: AlertOptions.error,
          iconKey: AlertIconKeys.homerError,
        });
    }
  };

  const handleSubmit = async function ({
    personImg,
  }: PredictInitialValues): Promise<void> {
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
        setNotification({
          content: 'Image is required!',
          type: AlertOptions.error,
          iconKey: AlertIconKeys.homerError,
        });

        return;
      }

      // const data = await predictSimpson(personImg);
      // receiveFeedback(data);
      return;
    } catch (e) {
      if (e instanceof Error)
        setNotification({
          content: e.message,
          type: AlertOptions.error,
          iconKey: AlertIconKeys.homerError,
        });
    }
  };

  const receiveFeedback = function (
    data: PredictSimpsonData | undefined
  ): void {
    if (!data) return;
    setPredictionData(data);

    setCharactersRun(true);
    setTimeout(() => {
      setCharactersRun(false);
    }, HOMER_RUN_TIMEOUT);

    setTimeout(() => {
      setDisplaySpeechBubble(true);
      setTimeout(() => {
        setDisplaySpeechBubble(false);
      }, DISPLAY_SPEECH_BUBBLE_TIMEOUT);
    }, ASK_FEEDBACK_TIMEOUT);

    setTimeout(setDefaultUserFeedback, SET_DEFAULT_USER_FEEDBACK);
    return;
  };

  const handleClickFeedbackHeart = function (value: boolean): void {
    predictionData
      ? setUserFeedback(value)
      : setNotification({
          content: 'Please predict first!',
          type: AlertOptions.warn,
        });
    return;
  };

  const setDefaultUserFeedback = (): void =>
    userFeedback === undefined ? setUserFeedback(null) : undefined;

  const handleUnload = function (): void {
    if (predictionData && userFeedback === undefined) {
      submitFeedbackToServer(predictionData, null);
      // navigator.sendBeacon(
      //   generateFetchURL('SEND_PREDICTION_FEEDBACK', {}, {}),
      //   JSON.stringify({
      //     userFeedback: null,
      //     permissionToStore,
      //     ...predictionData,
      //   })
      // );
    }
  };

  useEffect(() => {
    submitFeedbackToServer();
  }, [userFeedback]);

  useEffect(() => {
    window.addEventListener('unload', handleUnload);
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);

  return (
    <div className='flex items-center justify-between h-full gap-6 mx-32'>
      <div className='basis-1/2'>
        <div>
          {Object.entries(
            predictionData?.predictionData || DEFAULT_PREDICTION_DATA
          )
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value], index) => (
              <div
                key={`${index}#${key}`}
                className='flex gap-10 justify-between items-center w-full'
              >
                <div className='w-[calc(100%-160px)]'>
                  <ProgressBar
                    label={key as SimpsonCharacter}
                    colorKey={PROGRESS_BAR_COLORS[index]}
                    width={value}
                    charactersRun={charactersRun}
                  />
                </div>
                <div className='w-[120px]'>
                  {!predictionData ||
                  getMaxSimilarChar(predictionData.predictionData) === key ? (
                    <div className='mt-6 relative flex'>
                      {displaySpeechBubble ? (
                        <div className='absolute bottom-full right-full translate-x-1/2 transition-all'>
                          <SpeechBubble content='Smash like if you agree!' />
                        </div>
                      ) : null}
                      <div className='flex items-center justify-center'>
                        <LikeButton
                          onClick={() => handleClickFeedbackHeart(true)}
                          id={`like#${index}#${key}`}
                          isDisabled={!predictionData}
                        />
                        <DislikeButton
                          onClick={() => handleClickFeedbackHeart(false)}
                          id={`dislike#${index}#${key}`}
                          isDisabled={!predictionData}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className='basis-1/2 flex justify-center items-center'>
        <FileInputForm
          handleSubmit={handleSubmit}
          notification={notification}
          setNotification={setNotification}
          permissionToStore={permissionToStore}
          setPermissionToStore={setPermissionToStore}
        />
      </div>
    </div>
  );
}

interface FileInputFormProps {
  handleSubmit: (values: PredictInitialValues) => void;
  notification?: CustomNotification;
  setNotification: (value: CustomNotification | undefined) => void;
  permissionToStore: boolean;
  setPermissionToStore: (permission: boolean) => void;
}

const FileInputForm: FC<FileInputFormProps> = ({
  handleSubmit,
  notification,
  setNotification,
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
          content={notification?.content || errors.personImg}
          type={notification?.type}
          iconKey={notification?.iconKey}
          onAlertClose={(): void => {
            setFieldError(FORM_KEYS.PERSON_IMG, undefined);
            setNotification(undefined);
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
