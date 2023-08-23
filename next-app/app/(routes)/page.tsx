'use client';

import * as Yup from 'yup';
import axios from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { FORM_CONSTANTS, BUCKET_KEYS, REQUEST_URL_KEYS } from '../_constants';
import { FileInput, SubmitButton } from '../_components';
import { isValidFileType } from '../_helpers';
import { PredictInitialValues, PredictSimpsonData } from '../_types';
import { useEffect, useState } from 'react';

const sendFeedback = async function (
  feedback: boolean,
  { key }: PredictSimpsonData
): Promise<void> {
  try {
    const { data } = await axios.post(REQUEST_URL_KEYS.DELETE_PERSON_IMG, {
      feedback,
      key,
    });

    return data;
  } catch (e) {
    console.error(e);
  }
};

const predictSimpson = async function (
  img: File
): Promise<PredictSimpsonData | undefined> {
  try {
    const formData = new FormData();
    formData.append(BUCKET_KEYS.TRAIN, img);

    const {
      data: { predictData, key },
    } = await axios.post(REQUEST_URL_KEYS.PREDICT_PERSON_IMG, formData);

    return { predictData, key };
  } catch (e) {
    console.error(e);
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
  const [feedback, setFeedback] = useState<boolean | undefined>(undefined);
  const [predictSimpsonData, setPredictSimpsonData] = useState<
    PredictSimpsonData | undefined
  >(undefined);

  const receiveFeedback = function ({ predictData }: PredictSimpsonData) {
    console.log('Waiting for user feedback...');
    setFeedback(confirm(JSON.stringify(predictData)));
  };

  const handleSubmit = async function (
    { personImg }: any,
    { resetForm, setSubmitting }: FormikHelpers<any>
  ) {
    console.log('Submitting...');
    const data = await predictSimpson(personImg);
    setPredictSimpsonData(data);
    setSubmitting(false);
    resetForm();
  };

  useEffect(() => {
    predictSimpsonData && receiveFeedback(predictSimpsonData);
  }, [predictSimpsonData]);

  useEffect(() => {
    feedback !== undefined &&
      predictSimpsonData &&
      sendFeedback(feedback, predictSimpsonData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className='w-full max-w-sm space-y-6'>
            <FileInput
              name={'personImg'}
              accept={FORM_CONSTANTS.ACCEPT_PERSON_IMG_EXTENSIONS}
              setFieldValue={setFieldValue}
            />
            <SubmitButton />
          </Form>
        )}
      </Formik>
    </div>
  );
}
