'use client';
export const revalidate = 0;
/* eslint-disable react-hooks/exhaustive-deps */

import * as Yup from 'yup';
import axios from 'axios';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';

// Styles
import { akbar } from './fonts';

// Constants
import {
  ASK_FEEDBACK_TIMEOUT,
  DEFAULT_PREDICTION_DATA,
  DISPLAY_SPEECH_BUBBLE_TIMEOUT,
  FORM_CONSTANTS,
  FORM_KEYS,
  HOMER_RUN_TIMEOUT,
  PROGRESS_BAR_COLORS,
  QUERY_KEYS
} from '@src/constants';

// Types
import {
  FeedbackData,
  PredictSimpsonData,
  PredictInitialValues,
  AlertOptions,
  AlertIconKeys,
  SimpsonCharacter,
  CustomNotification,
  DetectFaceData
} from '@src/types';

// Components
import Alert from '@src/components/misc/Alert';
import ProgressBar from '@src/components/misc/ProgressBar';
import LikeButton from '@src/components/buttons/LikeButton';
import SpeechBubble from '@src/components/misc/SpeechBubble';
import DislikeButton from '@src/components/buttons/DislikeButton';
import SubmitButton from '@src/components/buttons/SubmitButton';
import CheckboxInput from '@src/components/inputs/Checkbox';
import FileInput from '@src/components/inputs/FileInput';
import Loader from '@src/components/misc/Loader';

// Helpers
import float2int from '@src/helpers/float2int';
import { generateFetchURL, getMaxSimilarChar, isValidFileType } from '@src/helpers';

// Hooks
import useQueryString from '@src/hooks/useQueryString';

// Utils
import { handleClientError } from '@src/utils/error';

// dev only
import faceDots from '@public/data.json';

const uploadImage = async function (personImg: File): Promise<string | undefined> {
  try {
    console.log('Generating presigned url...');
    const {
      data: { key, url }
    } = await axios.post(generateFetchURL('UPLOAD_IMAGE', {}, {}));

    console.log('Uploading image...');
    await axios.put(url, personImg);

    return key;
  } catch (e) {
    handleClientError(e);
  }
};

const detectFace = async function (url: string, key: string): Promise<DetectFaceData | undefined> {
  try {
    console.log('Detecting face...');
    const {
      data: { detectedFaceData }
    } = await axios.post(url, { key });

    return detectedFaceData;
  } catch (e) {
    handleClientError(e);
  }
};

const sendFeedback = async function (url: string, data: FeedbackData): Promise<void> {
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      keepalive: true
    });
  } catch (e) {
    handleClientError(e);
  }
};

const predictSimpson = async function (
  url: string,
  key: string
): Promise<PredictSimpsonData | undefined> {
  try {
    console.log('Requesting prediction...');
    const { data } = await axios.post(url, { key });

    return data;
  } catch (e) {
    handleClientError(e);
  }
};

const initialValues: PredictInitialValues = {
  personImg: undefined
};

const validationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  personImg: Yup.mixed<File>()
    .required('Image is required!')
    .test('fileType', 'Unsupported File Format.', (value) => {
      return isValidFileType(value.name && value.name.toLowerCase(), FORM_KEYS.PERSON_IMG);
    })
    .test(
      'fileSize',
      'File Size is too large.',
      (value: any) => value && value.size <= Number(FORM_CONSTANTS.MAX_PERSON_IMG_SIZE)
    )
});

export default function Main() {
  const [charactersRun, setCharactersRun] = useState<boolean>(false);
  const [displaySpeechBubble, setDisplaySpeechBubble] = useState<boolean>(false);
  const [predictionStored, setPredictionStored] = useState<boolean>(false);
  const [notification, setNotification] = useState<CustomNotification>();
  const [userFeedback, setUserFeedback] = useState<boolean | null>();
  const [permissionToStore, setPermissionToStore] = useState(true);
  const [predictionData, setPredictionData] = useState<PredictSimpsonData>();
  const [isVisibleProgressBar, setIsVisibleProgressBar] = useState<boolean>(false);
  const [isVisibleAbout, setIsVisibleAbout] = useState<boolean>(true);
  const [detectedFaceData, setDetectedFaceData] = useState<DetectFaceData | undefined>();

  const { createQueryString, updateQueryString, getQueryParam } = useQueryString();

  const submitFeedbackToServer = async function (
    data: PredictSimpsonData | undefined = predictionData,
    feedback: boolean | null | undefined = userFeedback
  ): Promise<void> {
    try {
      if (!data || feedback === undefined) return;
      await sendFeedback(generateFetchURL('SEND_PREDICTION_FEEDBACK', {}, {}), {
        userFeedback: feedback,
        permissionToStore,
        ...data
      });

      setPredictionStored(true);
    } catch (e) {
      if (e instanceof Error)
        setNotification({
          content: e.message,
          type: AlertOptions.error,
          iconKey: AlertIconKeys.homerError
        });
    }
  };

  const handleSubmit = async function ({ personImg }: PredictInitialValues): Promise<void> {
    try {
      if (predictionData && !predictionStored) {
        submitFeedbackToServer(predictionData, null);
      }

      // receiveFeedback({
      //   predictionData: {
      //     lisa_simpson: Math.random(),
      //     homer_simpson: Math.random(),
      //     bart_simpson: Math.random(),
      //     marge_simpson: Math.random()
      //   },
      //   predictionTime: 10,
      //   imageBucketKey: ''
      // });

      if (!personImg) {
        setNotification({
          content: 'Image is required!',
          type: AlertOptions.error,
          iconKey: AlertIconKeys.homerError
        });

        return;
      }

      const key = await uploadImage(personImg);
      if (!key) {
        console.error('Key is missing!');
        return;
      }
      const detectedFaceResponse = await detectFace(generateFetchURL('DETECT_FACE', {}, {}), key);

      if (!detectedFaceResponse) {
        console.error('Face is missing or there are several faces.');
        return;
      }
      console.log(detectedFaceResponse);
      setDetectedFaceData(detectedFaceResponse);

      const predictionResponse = await predictSimpson(
        generateFetchURL('REQUEST_PREDICTION', {}, {}),
        key
      );
      receiveFeedback(predictionResponse);

      return;
    } catch (e) {
      if (e instanceof Error)
        setNotification({
          content: e.message,
          type: AlertOptions.error,
          iconKey: AlertIconKeys.homerError
        });
    }
  };

  const receiveFeedback = function (data: PredictSimpsonData | undefined): void {
    if (!data) {
      setNotification({
        content: 'Predicted data is missing!',
        type: AlertOptions.error,
        iconKey: AlertIconKeys.homerError
      });

      return;
    }

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
          type: AlertOptions.warn
        });
      } else {
        setUserFeedback(value);
      }
    } else {
      e.preventDefault();
      setNotification({
        content: 'Please predict first!',
        type: AlertOptions.warn
      });
    }
    return;
  };

  const resetPageData = function (): void {
    console.log('Resetting page data...');
    setIsVisibleProgressBar(false);
    setIsVisibleAbout(true);
    setPredictionData(undefined);
    setPermissionToStore(true);
    setUserFeedback(null);
    setPredictionStored(false);
    setDisplaySpeechBubble(false);
    setCharactersRun(false);
    setDetectedFaceData(undefined);
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

  useEffect(() => {
    if (predictionData && !isVisibleProgressBar) {
      const path = createQueryString(QUERY_KEYS.WITH_PROGRESS_BAR);
      updateQueryString(path);

      setIsVisibleAbout(false);
      setTimeout(() => {
        setIsVisibleProgressBar(true);
      }, 500);
    }
  }, [predictionData]);

  useEffect(() => {
    const withProgressBar = getQueryParam(QUERY_KEYS.WITH_PROGRESS_BAR);
    if (withProgressBar === null && predictionData) {
      resetPageData();
    }
  }, [getQueryParam(QUERY_KEYS.WITH_PROGRESS_BAR)]);

  return (
    <>
      <div className="hidden md:block absolute left-24 top-32 w-fit">
        <About isVisible={isVisibleAbout} />
      </div>

      <div
        className={`h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] px-4 py-4 md:py-0 md:px-32 flex flex-col md:flex-row items-center justify-between ${
          predictionData ? 'gap-5' : 'gap-0'
        }`}
      >
        <div
          className={
            predictionData
              ? 'flex flex-none items-start md:items-center w-full h-fit md:w-1/2 md:h-full transition-all transform origin-left scale-x-1 duration-500 relative'
              : 'flex items-start md:items-center w-0 h-0 md:h-full transition-all transform origin-left scale-x-0 duration-500'
          }
        >
          <ProgressBarWrapper
            predictionData={predictionData?.predictionData || DEFAULT_PREDICTION_DATA}
            charactersRun={charactersRun}
            displaySpeechBubble={displaySpeechBubble}
            userFeedback={userFeedback}
            handleClickFeedbackHeart={handleClickFeedbackHeart}
            isVisible={isVisibleProgressBar}
          />
        </div>

        <div className="flex flex-1 flex-grow items-center md:items-center justify-stretch md:justify-center w-full duration-500 min-h-0 h-full md:h-fit">
          <FileInputForm
            detectedFaceData={detectedFaceData}
            resetPageData={resetPageData}
            setIsVisibleAbout={setIsVisibleAbout}
            handleSubmit={handleSubmit}
            notification={notification}
            setNotification={setNotification}
            permissionToStore={permissionToStore}
            setPermissionToStore={setPermissionToStore}
            isDataPredicted={!!predictionData}
          />
        </div>
        <div className={`${isVisibleAbout ? 'block mt-4' : 'hidden'} md:hidden`}>
          <About isVisible={isVisibleAbout} />
        </div>
      </div>
    </>
  );
}

interface FileInputFormProps {
  handleSubmit: (values: PredictInitialValues) => void;
  notification?: CustomNotification;
  setNotification: (value: CustomNotification | undefined) => void;
  permissionToStore: boolean;
  setPermissionToStore: (permission: boolean) => void;
  setIsVisibleAbout: (isVisible: boolean) => void;
  resetPageData: () => void;
  isDataPredicted: boolean;
  detectedFaceData?: DetectFaceData;
}

const FileInputForm: FC<FileInputFormProps> = ({
  handleSubmit,
  notification,
  setNotification,
  permissionToStore,
  setPermissionToStore,
  setIsVisibleAbout,
  isDataPredicted,
  resetPageData,
  detectedFaceData
}) => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
        {isSubmitting && !detectedFaceData ? <Loader /> : null}
        <Form
          className={`w-full h-full min-h-0 md:max-w-sm flex flex-col flex-1 justify-center ${
            isDataPredicted ? 'gap-6' : 'gap-4'
          }`}
        >
          <div className="flex flex-1 min-h-0">
            <FileInput
              detectedFaceData={detectedFaceData}
              name={FORM_KEYS.PERSON_IMG}
              accept={FORM_CONSTANTS.ACCEPT_PERSON_IMG_EXTENSIONS}
              setFieldValue={setFieldValue}
              setIsVisibleAbout={setIsVisibleAbout}
              resetPageData={resetPageData}
              isDataPredicted={isDataPredicted}
              isSubmitting={isSubmitting && !detectedFaceData}
            />
          </div>
          <div className="flex flex-none flex-row justify-between">
            <CheckboxInput
              label="Data can be stored."
              checked={permissionToStore}
              onChange={setPermissionToStore}
            />
            <SubmitButton isDisabled={isSubmitting} />
          </div>
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
  handleClickFeedbackHeart: (e: ChangeEvent<HTMLInputElement>, value: boolean) => void;
  isVisible: boolean;
}

const ProgressBarWrapper: FC<ProgressBarWrapperProps> = ({
  predictionData,
  charactersRun,
  displaySpeechBubble,
  userFeedback,
  handleClickFeedbackHeart,
  isVisible
}) => {
  const [isVisibleFeedback, setIsVisibleFeedback] = useState<boolean>(false);

  useEffect(() => {
    displaySpeechBubble && setIsVisibleFeedback(true);
  }, [displaySpeechBubble]);

  return (
    <div className="w-full">
      {Object.entries(predictionData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value], index) => (
          <div
            key={`${index}#${key}`}
            className="flex gap-4 md:gap-10 justify-between items-center w-full"
          >
            <div className="w-[calc(100%-16px-80px)]">
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
              <div className="w-[80px] md:w-[120px]">
                {isVisibleFeedback && getMaxSimilarChar(predictionData) === key ? (
                  <div className="mt-6 relative flex">
                    {displaySpeechBubble ? (
                      <>
                        <div className="absolute bottom-full right-0 md:right-full md:translate-x-full transition-all block md:hidden">
                          <SpeechBubble content="Agree?" />
                        </div>
                        <div className="absolute bottom-full right-0 md:right-full md:translate-x-full transition-all hidden md:block">
                          <SpeechBubble content="Do you agree?" />
                        </div>
                      </>
                    ) : null}
                    <div className="flex items-center justify-center">
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

interface AboutProps {
  isVisible: boolean;
}

const About: FC<AboutProps> = function ({ isVisible }) {
  return (
    <div
      className={`${
        isVisible ? 'opacity-1' : 'opacity-0'
      } px-4 md:px-0 w-screen md:max-w-md transition-opacity transition-duration-200`}
    >
      <div className="w-fit">
        <h1 className={`${akbar.className} text-base md:text-xl font-bold`}>About</h1>
      </div>
      <div className="text-sm md:text-base transform md:-rotate-[15deg] md:font-medium">
        <p>
          Find out which <span className="text-primary">Simpsons character</span> you look like
          <br />
          with our <span className="text-primary">machine learning</span> app.
        </p>
        <p>
          Upload a <span className="text-primary">picture</span> of yourself to get started.
        </p>
      </div>
    </div>
  );
};
