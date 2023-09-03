const SubmitButton = function () {
  return (
    <div className='flex items-center justify-end'>
      <button
        type='submit'
        className='px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700'
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
