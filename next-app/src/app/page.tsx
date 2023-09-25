'use client';
export const revalidate = 0;
/* eslint-disable react-hooks/exhaustive-deps */

import * as Yup from 'yup';
import axios from 'axios';
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';

import SubmitButton from '@src/components/buttons/SubmitButton';
import CheckboxInput from '@src/components/inputs/Checkbox';
import FileInput from '@src/components/inputs/FileInput';
import Loader from '@src/components/misc/Loader';

import {
  ASK_FEEDBACK_TIMEOUT,
  DISPLAY_SPEECH_BUBBLE_TIMEOUT,
  FORM_CONSTANTS,
  FORM_KEYS,
  HOMER_RUN_TIMEOUT,
  PROGRESS_BAR_COLORS,
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
import float2int from '@src/helpers/float2int';

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
  const [predictionStored, setPredictionStored] = useState<boolean>(false);
  const [notification, setNotification] = useState<CustomNotification>();
  const [userFeedback, setUserFeedback] = useState<boolean | null>();
  const [permissionToStore, setPermissionToStore] = useState(true);
  const [predictionData, setPredictionData] = useState<PredictSimpsonData>();

  const submitFeedbackToServer = async function (
    data: PredictSimpsonData | undefined = predictionData,
    feedback: boolean | null | undefined = userFeedback
  ): Promise<void> {
    try {
      if (!data || feedback === undefined) return;
      await sendFeedback(generateFetchURL('SEND_PREDICTION_FEEDBACK', {}, {}), {
        userFeedback: feedback,
        permissionToStore,
        ...data,
      });

      setPredictionStored(true);
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
      if (predictionData && !predictionStored) {
        submitFeedbackToServer(predictionData, null);
      }

      receiveFeedback({
        predictionData: {
          lisa_simpson: Math.random(),
          homer_simpson: Math.random(),
          bart_simpson: Math.random(),
          marge_simpson: Math.random(),
        },
        predictionTime: 10,
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

      const data = await predictSimpson(personImg);
      receiveFeedback(data);
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
    if (!data) {
      setNotification({
        content: 'Predicted data is missing!',
        type: AlertOptions.error,
        iconKey: AlertIconKeys.homerError,
      });

      return;
    }

    // reset previous prediction
    setPredictionStored(false);
    setUserFeedback(undefined);

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

    return;
  };

  const handleClickFeedbackHeart = function (
    e: ChangeEvent<HTMLInputElement>,
    value: boolean
  ): void {
    if (predictionData) {
      if (predictionStored) {
        e.preventDefault();
        setNotification({
          content: 'Feedback already stored.',
          type: AlertOptions.warn,
        });
      } else {
        setUserFeedback(value);
      }
    } else {
      e.preventDefault();
      setNotification({
        content: 'Please predict first!',
        type: AlertOptions.warn,
      });
    }
    return;
  };

  useEffect(() => {
    submitFeedbackToServer();
  }, [userFeedback]);

  // send feedback to server on page unload
  useEffect(() => {
    const handleUnload = () => submitFeedbackToServer(predictionData, null);

    if (predictionData && userFeedback === undefined) {
      window.addEventListener('unload', handleUnload);
      return () => {
        window.removeEventListener('unload', handleUnload);
      };
    }
  }, [predictionData, userFeedback]);

  return (
    <div className='h-full px-32 flex items-center justify-between overflow-hidden'>
      <div
        className={
          predictionData
            ? 'flex items-center w-1/2 h-full transition-all transform origin-left scale-x-1 duration-[500ms] relative'
            : 'flex items-center w-0 h-full transition-all transform origin-left scale-x-0 duration-[500ms]'
        }
      >
        {predictionData ? (
          <ProgressBarWrapper
            predictionData={predictionData?.predictionData}
            charactersRun={charactersRun}
            displaySpeechBubble={displaySpeechBubble}
            userFeedback={userFeedback}
            handleClickFeedbackHeart={handleClickFeedbackHeart}
          />
        ) : null}
      </div>

      <div
        className={
          predictionData
            ? 'basis-1/2 flex items-center justify-center w-full h-full transition-all duration-[500ms]'
            : 'basis-full flex items-center justify-center w-full h-full transition-all duration-[500ms]'
        }
      >
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

interface ProgressBarWrapperProps {
  predictionData: Record<SimpsonCharacter, number>;
  charactersRun: boolean;
  displaySpeechBubble: boolean;
  userFeedback: boolean | null | undefined;
  handleClickFeedbackHeart: (
    e: ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => void;
}

const ProgressBarWrapper: FC<ProgressBarWrapperProps> = ({
  predictionData,
  charactersRun,
  displaySpeechBubble,
  userFeedback,
  handleClickFeedbackHeart,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isVisibleFeedback, setIsVisibleFeedback] = useState<boolean>(false);

  useEffect(() => {
    !isVisible &&
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
  }, []);

  useEffect(() => {
    displaySpeechBubble && setIsVisibleFeedback(true);
  }, [displaySpeechBubble]);

  return (
    <div className='w-full'>
      {Object.entries(predictionData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value], index) => (
          <div
            key={`${index}#${key}`}
            className='flex gap-10 justify-between items-center w-full'
          >
            <div className='w-[calc(100%-160px)]'>
              <ProgressBar
                isVisible={isVisible}
                label={key as SimpsonCharacter}
                colorKey={PROGRESS_BAR_COLORS[index]}
                width={float2int(value * 100)}
                charactersRun={charactersRun}
                delay={float2int(value * 1000)}
              />
            </div>
            {isVisible ? (
              <div className='w-[120px]'>
                {isVisibleFeedback &&
                getMaxSimilarChar(predictionData) === key ? (
                  <div className='mt-6 relative flex'>
                    {displaySpeechBubble ? (
                      <div className='absolute bottom-full right-full translate-x-full transition-all'>
                        <SpeechBubble content='Do you agree?' />
                      </div>
                    ) : null}
                    <div className='flex items-center justify-center'>
                      <LikeButton
                        userFeedback={userFeedback}
                        onClick={handleClickFeedbackHeart}
                        id={`like#${index}#${key}`}
                      />
                      <DislikeButton
                        userFeedback={userFeedback}
                        onClick={handleClickFeedbackHeart}
                        id={`dislike#${index}#${key}`}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
};
