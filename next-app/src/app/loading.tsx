import Loader from '@src/components/misc/Loader';

export default function Loading() {
  return (
    <Loader
      width={'200'}
      height={'200'}
      wrapperClass={
        'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50'
      }
    />
  );
}
