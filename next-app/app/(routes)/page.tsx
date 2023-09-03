/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import * as Yup from 'yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';

import { FORM_CONSTANTS, BUCKET_KEYS, REQUEST_URL_KEYS } from '../_constants';
import { FileInput, SubmitButton } from '../_components';
import { isValidFileType } from '../_helpers';
import { PredictInitialValues, PredictSimpsonData } from '../_types';
import Loader from './loading';

const sendFeedback = async function (
  feedback: boolean | null,
  permission: boolean,
  { key, predictData, predictTime }: PredictSimpsonData
): Promise<void> {
  try {
    const { data } = await axios.post(REQUEST_URL_KEYS.DELETE_PERSON_IMG, {
      permission,
      feedback,
      key,
      predictData,
      predictTime,
    });

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e);
  }
};

const predictSimpson = async function (
  img: File
): Promise<PredictSimpsonData | undefined> {
  try {
    const formData = new FormData();
    formData.append(BUCKET_KEYS.TRAIN, img);

    const { data } = await axios.post(
      REQUEST_URL_KEYS.PREDICT_PERSON_IMG,
      formData
    );

    return data;
  } catch (e) {
    if (e instanceof Error) console.error(e);
  }
};

const initialValues: PredictInitialValues = {
  personImg: null,
};

const validationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  personImg: Yup.mixed<File>()
    .required('An image is required')
    .test('fileType', 'Unsupported File Format', (value) => {
      return isValidFileType(
        value.name && value.name.toLowerCase(),
        'personImg'
      );
    })
    .test(
      'fileSize',
      'File Size is too large',
      (value: any) =>
        value && value.size <= Number(FORM_CONSTANTS.MAX_PERSON_IMG_SIZE)
    ),
});

export default function Home() {
  const [feedback, setFeedback] = useState<boolean | null | undefined>(
    undefined
  );
  const [permission, setPermission] = useState<boolean | undefined>(
    undefined
  );
  const [predictSimpsonData, setPredictSimpsonData] = useState<
    PredictSimpsonData | undefined
  >(undefined);

  const receiveFeedback = function (): void {
    if (predictSimpsonData === undefined) return;
    setFeedback(
      confirm('Do u agree?' + JSON.stringify(predictSimpsonData.predictData))
    );
    setPermission(confirm('Can we store your data?'));
  };

  const resetData = async function (): Promise<void> {
    if (
      feedback === undefined ||
      permission === undefined ||
      predictSimpsonData === undefined
    )
      return;
    await sendFeedback(feedback, permission, predictSimpsonData);
    setFeedback(undefined);
    setPermission(undefined);
    setPredictSimpsonData(undefined);
  };

  const handleSubmit = async function (
    { personImg }: any,
    { resetForm }: FormikHelpers<any>
  ) {
    console.log('Submitting...');
    const data = await predictSimpson(personImg);
    setPredictSimpsonData(data);
    // resetForm();
  };

  useEffect(() => {
    receiveFeedback();
  }, [predictSimpsonData]);

  useEffect(() => {
    resetData();
  }, [permission]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <>
            {isSubmitting && <Loader />}
            <Form className='w-full max-w-sm space-y-6'>
              <FileInput
                name={'personImg'}
                accept={FORM_CONSTANTS.ACCEPT_PERSON_IMG_EXTENSIONS}
                setFieldValue={setFieldValue}
              />
              <SubmitButton />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}
