// Modal.tsx
import { SimpsonCharacter } from '@app/_types';
import { FC } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onApprove: () => void;
  onDisapprove: () => void;
  data: Record<SimpsonCharacter, number> | undefined;
}

const Modal: FC<ModalProps> = ({
  show,
  onClose,
  onApprove,
  onDisapprove,
  data,
}) => {
  if (!show || !data) return null;

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10'
      onClick={onClose}
    >
      <div className='bg-white rounded-lg p-8 w-1/2' onClick={handleInnerClick}>
        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-4'>Prediction Result:</h2>
          {Object.entries(data).map(([character, confidence]) => (
            <p key={character}>
              <strong>{character.replace('_', ' ').toUpperCase()}:</strong>{' '}
              {(confidence * 100).toFixed(2)}%
            </p>
          ))}
        </div>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={onApprove}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Approve
          </button>
          <button
            onClick={onDisapprove}
            className='bg-red-500 text-white px-4 py-2 rounded'
          >
            Disapprove
          </button>
          <button
            onClick={onClose}
            className='bg-gray-500 text-white px-4 py-2 rounded'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
