import { REQUEST_URL_KEYS } from '@app/_constants';
import { RequestParams, RequestSearchParams } from '@app/_types';

const generateFetchURL = (
  key: keyof typeof REQUEST_URL_KEYS,
  searchParams: RequestSearchParams,
  params: RequestParams
): string => {
  const currSearchParams = new URLSearchParams(searchParams);

  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api${REQUEST_URL_KEYS[key]}?${currSearchParams}`;

  const modifiedUrl = Object.entries(params).reduce(
    (acc, [key, value]) =>
      value ? acc.replace(`:${key}`, value.toString()) : acc,
    url
  );

  return modifiedUrl;
};

export { generateFetchURL };
