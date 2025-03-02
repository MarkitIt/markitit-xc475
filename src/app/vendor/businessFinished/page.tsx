"use client";

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import '../../tailwind.css';

const BusinessPastPopup = () => {
  const router = useRouter();
  const [selectedPopups, setSelectedPopups] = useState<string[]>([]);

  const handleNextStepClick = () => {
    router.push('/');
    // This is where you would save the data to the database
  };

  const popups = [
    "Innovative Insights Expo","Reliable Solutions Showcase","Efficient Tech Symposium","Creative Minds Workshop",
    "Professional Growth Summit","Dynamic Innovations Fair","Friendly Networking Hub","Trustworthy Trends Conference",
    "Experienced Leaders Forum","Passionate Pioneers Meetup","Dedicated Developers Day","Skilled Strategists Seminar"
  ];

  const handlePopupClick = (popup: string) => {
    setSelectedPopups(prevSelected =>
      prevSelected.includes(popup)
        ? prevSelected.filter(item => item !== popup)
        : [...prevSelected, popup]
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Past Popup section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 05/05</h2>
          <h1 className="text-5xl font-bold mb-8">Final review</h1>
          {/* List for all adjective */}
          <div className="grid grid-cols-4 gap-4">
            {popups.map((popup, index) => (
              <button
                key={index}
                className={`h-12 flex items-center justify-center hover:bg-gray-400 ${selectedPopups.includes(popup) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handlePopupClick(popup)}
              >
                {popup}
              </button>
            ))}
          </div>

          {/* Next step click */}
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
            <div
              className="w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
              onClick={handleNextStepClick}
            >
              Next Step
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessPastPopup;