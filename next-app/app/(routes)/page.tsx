'use client';

import * as Yup from 'yup';
import axios from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import {
  FORM_CONSTANTS,
  PREDICT_SIMP_FILENAME,
  REQUEST_URL_KEYS,
} from '../_constants';
import { FileInput, SubmitButton } from '../_components';
import { isValidFileType } from '../_helpers';
import { PredictInitialValues } from '../_types';

const predictSimpson = async (img: File): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append(PREDICT_SIMP_FILENAME, img);

    const { data } = await axios.post(
      REQUEST_URL_KEYS.PREDICT_PERSON_IMG,
      formData
    );

    alert(JSON.stringify(data));
    return data;
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
  const handleSubmit = async (
    { personImg }: any,
    { resetForm, setSubmitting }: FormikHelpers<any>
  ) => {
    console.log('Submitting...');
    await predictSimpson(personImg);
    setSubmitting(false);
    resetForm();
  };

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
