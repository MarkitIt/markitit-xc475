'use client';

import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface CustomQuestionFieldProps {
  index: number;
  onDelete: (index: number) => void;
  onUpdate: (index: number, data: { title: string; description: string; isRequired: boolean }) => void;
}

export default function CustomQuestionField({
  index,
  onDelete,
  onUpdate,
}: CustomQuestionFieldProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRequired, setIsRequired] = useState(false);

  // Handle changes to the title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log('Title changed:', e.target.value); // Debugging line
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate(index, { title: newTitle, description, isRequired });
  };

  // Handle changes to the description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //console.log('Description changed:', e.target.value); // Debugging line
    const newDescription = e.target.value;
    setDescription(newDescription);
    onUpdate(index, { title, description: newDescription, isRequired });
  };

  // Handle changes to the required checkbox
  const handleRequiredChange = () => {
    const newIsRequired = !isRequired;
    setIsRequired(newIsRequired);
    onUpdate(index, { title, description, isRequired: newIsRequired });
  };

  return (
    <div className="mb-6 p-6 border-2 border-gray-300 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-6">
          <h3 className="text-xl font-semibold text-black">Question {index + 1}</h3>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={isRequired}
              onChange={handleRequiredChange}
              className="w-5 h-5 rounded border-2 border-gray-400 checked:bg-[#f15152]"
            />
            <label htmlFor={`required-${index}`} className="text-lg text-gray-700">
              Required
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="text-gray-500 hover:text-[#f15152] transition p-2"
        >
          <FiTrash2 size={24} />
        </button>
      </div>

      <div className="mb-6">
        <label
          className="block text-xl mb-3 text-center text-black font-semibold"
          htmlFor={`question-${index}`}
        >
          Question Title
        </label>
        <input
          type="text"
          id={`question-${index}`}
          name={`question-${index}`}
          value={title}
          onChange={handleTitleChange}
          placeholder="e.g., Do you have any dietary restrictions?"
          className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white"
        />
      </div>

      <div>
        <label
          className="block text-xl mb-3 text-center text-black font-semibold"
          htmlFor={`description-${index}`}
        >
          Description (Optional)
        </label>
        <textarea
          id={`description-${index}`}
          name={`description-${index}`}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Add more details about what information you're looking for..."
          rows={4}
          className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white"
        />
      </div>
    </div>
  );
}