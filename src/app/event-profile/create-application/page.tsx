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
    // change redirect after decided where
    // router.push('/event-profile/dashboard');
  };

  return (
    <div className='flex flex-col items-center justify-center p-8 min-h-screen bg-white'>
      <div className='w-full' style={{ width: '60%' }}>
        <h1 className='text-3xl font-bold text-center mb-4 text-black'>
          Create Application Form
        </h1>
        <p className='text-lg text-gray-700 text-center mb-8'>
          Set up your vendor application form with the information you need from
          applicants
        </p>

        <form onSubmit={handleSubmit} className='space-y-12'>
          <div className='mb-10'>
            <h2 className='text-2xl font-semibold mb-6 text-black text-center'>
              Event Information
            </h2>

            <div className='mb-6'>
              <label
                className='block text-xl mb-3 text-center text-black font-semibold'
                htmlFor='event-name'
              >
                Event Name
              </label>
              <input
                type='text'
                id='event-name'
                name='event-name'
                placeholder='Enter your event name'
                className='w-full p-4 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-700 text-black'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div>
                <label
                  className='block text-xl mb-3 text-center text-black font-semibold'
                  htmlFor='event-date'
                >
                  Event Date
                </label>
                <input
                  type='date'
                  id='event-date'
                  name='event-date'
                  className='w-full p-4 border-2 border-gray-300 rounded-lg bg-white text-black'
                  required
                />
              </div>
              <div>
                <label
                  className='block text-xl mb-3 text-center text-black font-semibold'
                  htmlFor='application-deadline'
                >
                  Application Deadline
                </label>
                <input
                  type='date'
                  id='application-deadline'
                  name='application-deadline'
                  className='w-full p-4 border-2 border-gray-300 rounded-lg bg-white text-black'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  className='block text-xl mb-3 text-center text-black font-semibold'
                  htmlFor='booth-cost'
                >
                  Booth Cost ($)
                </label>
                <input
                  type='number'
                  id='booth-cost'
                  name='booth-cost'
                  placeholder='0.00'
                  className='w-full p-4 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-700 text-black'
                  min='0'
                  step='0.01'
                  required
                />
              </div>
              <div>
                <label
                  className='block text-xl mb-3 text-center text-black font-semibold'
                  htmlFor='location'
                >
                  Location
                </label>
                <input
                  type='text'
                  id='location'
                  name='location'
                  placeholder='Event location'
                  className='w-full p-4 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-700'
                  required
                />
              </div>
            </div>
          </div>

          <div className='mb-10'>
            <h2 className='text-2xl font-semibold mb-6 text-black text-center'>
              Standard Application Fields
            </h2>
            <p className='text-lg text-gray-700 text-center mb-6'>
              Select the information you want to collect from vendors.
            </p>

            <div className='p-6 border-2 border-gray-300 rounded-lg bg-white'>
              <div className='flex flex-col'>
                {standardFields.map((field, index) => (
                  <div key={field.id}>
                    <div className='flex items-center justify-between py-6'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          id={field.id}
                          checked={selectedFields.includes(field.id)}
                          onChange={() => handleFieldToggle(field.id)}
                          className='w-8 h-8 rounded border-2 border-gray-400 checked:bg-[#f15152] bg-white'
                        />
                      </div>
                      <label
                        htmlFor={field.id}
                        className='text-xl font-medium text-black'
                      >
                        {field.label}
                      </label>
                    </div>
                    {index < standardFields.length - 1 && (
                      <div className='border-b border-gray-200'></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='mb-10'>
            <div className='flex flex-col items-center mb-6'>
              <h2 className='text-2xl font-semibold text-black text-center mb-6'>
                Custom Questions
              </h2>
              <p className='text-lg text-gray-700 text-center mb-6'>
                Add custom questions that will appear on a separate page of the
                application. Applicants will need to complete these questions
                before submitting.
              </p>
              <button
                type='button'
                onClick={addCustomQuestion}
                className='py-4 bg-[#f15152] text-white text-xl font-semibold rounded-lg hover:bg-red-600 transition px-8'
              >
                <FiPlus className='inline mr-2' /> Add Question
              </button>
            </div>

            {customQuestions.length === 0 ? (
              <div className='p-10 border-2 border-gray-300 rounded-lg bg-white flex flex-col items-center'>
                <p className='text-xl text-gray-500 mb-6'>
                  No custom questions added yet.
                </p>
                <button
                  type='button'
                  onClick={addCustomQuestion}
                  className='py-4 bg-[#f15152] text-white text-xl font-semibold rounded-lg hover:bg-red-600 transition px-8'
                ></button>
              </div>
            ) : (
              <div className='space-y-6'>
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

          <div className='flex justify-center'>
            <div style={{ width: '50%', margin: '0 auto' }}>
              <button
                type='submit'
                className='w-full py-4 bg-[#f15152] text-white text-xl font-semibold rounded-lg hover:bg-red-600 transition'
                style={{ marginBottom: '10px' }}
              >
                Create Application
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
