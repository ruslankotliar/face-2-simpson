const SubmitButton = function () {
  return (
    <div className='flex items-center justify-end'>
      <button
        type='submit'
        className='px-4 py-2 text-white bg-highlight rounded-md hover:bg-opacity-90 hover:shadow-lg transition-all duration-300'
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
