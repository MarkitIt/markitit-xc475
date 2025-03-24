'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomQuestionField from '../../../components/CustomQuestionField';
import { FiPlus } from 'react-icons/fi';

export default function CreateApplicationPage() {
  const router = useRouter();
  const [customQuestions, setCustomQuestions] = useState<number[]>([]);

  // Standard fields that can be selected
  const standardFields = [
    { id: 'business-name', label: 'Business Name' },
    { id: 'business-type', label: 'Business Type' },
    { id: 'contact-name', label: 'Contact Name' },
    { id: 'contact-email', label: 'Contact Email' },
    { id: 'contact-phone', label: 'Contact Phone' },
    { id: 'social-media', label: 'Social Media Links' },
    { id: 'product-description', label: 'Product Description' },
    { id: 'price-range', label: 'Price Range' },
    { id: 'website', label: 'Website' },
    { id: 'product-images', label: 'Product Images' },
    { id: 'past-events', label: 'Past Events Experience' },
    { id: 'space-requirements', label: 'Space Requirements' },
  ];

  const [selectedFields, setSelectedFields] = useState<string[]>([
    // basic fields selected
    'business-name',
    'contact-email',
    'contact-phone',
  ]);

  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const addCustomQuestion = () => {
    setCustomQuestions([...customQuestions, customQuestions.length]);
  };

  const removeCustomQuestion = (indexToRemove: number) => {
    setCustomQuestions(
      customQuestions.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    // uncomment after route added or decided
    // router.push('/event-profile/dashboard');
  };

  return (
    <div className='flex flex-col items-center p-8 min-h-screen bg-white'>
      <div className='w-full max-w-3xl'>
        <h1 className='text-3xl font-bold text-center mb-4 text-black'>
          Create Application Form
        </h1>
        <p className='text-lg text-gray-700 text-center mb-8'>
          Set up your vendor application form with the information you need from
          applicants
        </p>

        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4 text-black'>
              Event Information
            </h2>
            <div className='bg-gray-50 p-6 rounded-lg border-2 border-gray-200'>
              <div className='mb-4'>
                <label
                  className='block text-gray-700 mb-2 font-medium'
                  htmlFor='event-name'
                >
                  Event Name
                </label>
                <input
                  type='text'
                  id='event-name'
                  name='event-name'
                  placeholder='Enter your event name'
                  className='w-full p-3 border-2 border-gray-300 rounded-lg'
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label
                    className='block text-gray-700 mb-2 font-medium'
                    htmlFor='event-date'
                  >
                    Event Date
                  </label>
                  <input
                    type='date'
                    id='event-date'
                    name='event-date'
                    className='w-full p-3 border-2 border-gray-300 rounded-lg'
                    required
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 mb-2 font-medium'
                    htmlFor='application-deadline'
                  >
                    Application Deadline
                  </label>
                  <input
                    type='date'
                    id='application-deadline'
                    name='application-deadline'
                    className='w-full p-3 border-2 border-gray-300 rounded-lg'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    className='block text-gray-700 mb-2 font-medium'
                    htmlFor='booth-cost'
                  >
                    Booth Cost ($)
                  </label>
                  <input
                    type='number'
                    id='booth-cost'
                    name='booth-cost'
                    placeholder='0.00'
                    className='w-full p-3 border-2 border-gray-300 rounded-lg'
                    min='0'
                    step='0.01'
                    required
                  />
                </div>
                <div>
                  <label
                    className='block text-gray-700 mb-2 font-medium'
                    htmlFor='location'
                  >
                    Location
                  </label>
                  <input
                    type='text'
                    id='location'
                    name='location'
                    placeholder='Event location'
                    className='w-full p-3 border-2 border-gray-300 rounded-lg'
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Standard Fields Section */}
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4 text-black'>
              Standard Application Fields
            </h2>
            <p className='text-gray-600 mb-4'>
              Select the information you want to collect from vendors.
            </p>

            <div className='bg-gray-50 p-6 rounded-lg border-2 border-gray-200'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {standardFields.map((field) => (
                  <div key={field.id} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onChange={() => handleFieldToggle(field.id)}
                      className='mr-3 h-5 w-5'
                    />
                    <label htmlFor={field.id} className='text-gray-700'>
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Questions Section */}
          <div className='mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-black'>
                Custom Questions
              </h2>
              <button
                type='button'
                onClick={addCustomQuestion}
                className='flex items-center bg-[#f15152] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
              >
                <FiPlus className='mr-2' /> Add Question
              </button>
            </div>

            <p className='text-gray-600 mb-4'>
              Add custom questions that will appear on a separate page of the
              application. Applicants will need to complete these questions
              before submitting.
            </p>

            {customQuestions.length === 0 ? (
              <div className='bg-gray-50 p-8 rounded-lg border-2 border-gray-200 flex flex-col items-center'>
                <p className='text-gray-500 mb-4'>
                  No custom questions added yet.
                </p>
                <button
                  type='button'
                  onClick={addCustomQuestion}
                  className='flex items-center bg-[#f15152] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
                >
                  <FiPlus className='mr-2' /> Add Your First Question
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                {customQuestions.map((_, index) => (
                  <CustomQuestionField
                    key={index}
                    index={index}
                    onDelete={removeCustomQuestion}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex justify-center'>
            <button
              type='submit'
              className='px-8 py-4 bg-[#f15152] text-white text-xl font-semibold rounded-lg hover:bg-red-600 transition'
              style={{ width: '50%' }}
            >
              Create Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
