/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useQueryString = function () {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()! as any;

  const createQueryString = useCallback(
    (name: string, value: string): string => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return `${pathname}?${params.toString()}`;
    },
    [searchParams]
  );

  const updateQueryString = (path: string): void => router.push(path);

  return { createQueryString, updateQueryString };
};
export default useQueryString;
