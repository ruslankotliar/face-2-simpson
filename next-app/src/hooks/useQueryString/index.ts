/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useQueryString = function () {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | number | boolean = ''): string => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value.toString());

      return `${pathname}?${params.toString()}`;
    },
    [searchParams]
  );

  const updateQueryString = (path: string): void => router.push(path);

  const getQueryParam = (name: string): string | null => searchParams.get(name);

  const deleteQueryParam = function (name: string) {
    const params = new URLSearchParams(searchParams);
    params.delete(name);

    return `${pathname}?${params.toString()}`;
  };

  return {
    createQueryString,
    updateQueryString,
    getQueryParam,
    deleteQueryParam,
  };
};
export default useQueryString;
