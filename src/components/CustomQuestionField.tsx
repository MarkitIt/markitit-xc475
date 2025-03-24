'use client';

import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface CustomQuestionFieldProps {
  index: number;
  onDelete: (index: number) => void;
}

export default function CustomQuestionField({
  index,
  onDelete,
}: CustomQuestionFieldProps) {
  const [isRequired, setIsRequired] = useState(false);

  return (
    <div className='mb-6 p-4 border-2 border-gray-300 rounded-lg'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <h3 className='text-lg font-semibold'>Question {index + 1}</h3>
          <div className='ml-4 flex items-center'>
            <input
              type='checkbox'
              id={`required-${index}`}
              checked={isRequired}
              onChange={() => setIsRequired(!isRequired)}
              className='mr-2 h-4 w-4'
            />
            <label htmlFor={`required-${index}`}>Required</label>
          </div>
        </div>
        <button
          type='button'
          onClick={() => onDelete(index)}
          className='text-gray-500 hover:text-red-500'
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      <div className='mb-4'>
        <label
          className='block text-gray-700 mb-2'
          htmlFor={`question-${index}`}
        >
          Question Title
        </label>
        <input
          type='text'
          id={`question-${index}`}
          name={`question-${index}`}
          placeholder='e.g., Do you have any dietary restrictions?'
          className='w-full p-3 border-2 border-gray-300 rounded-lg'
        />
      </div>

      <div>
        <label
          className='block text-gray-700 mb-2'
          htmlFor={`description-${index}`}
        >
          Description (Optional)
        </label>
        <textarea
          id={`description-${index}`}
          name={`description-${index}`}
          placeholder="Add more details about what information you're looking for..."
          rows={2}
          className='w-full p-3 border-2 border-gray-300 rounded-lg'
        />
      </div>
    </div>
  );
}
