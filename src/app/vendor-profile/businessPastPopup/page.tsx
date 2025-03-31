"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useBusinessPastPopupContext } from '../../../context/BusinessPastPopupContext';
import '../../tailwind.css';

const BusinessPastPopup = () => {
  const router = useRouter();
  const {selectedPastPopups, setSelectedPastPopups} : { selectedPastPopups: string[], setSelectedPastPopups: React.Dispatch<React.SetStateAction<string[]>> } = useBusinessPastPopupContext();
  //const { selectedCategories, setSelectedCategories }: { selectedCategories: string[], setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>> } = useBusinessAdjectiveContext();

  const handleNextStepClick = () => {
    router.push('/vendor-profile/businessFinished');
  };

  const pastPopups = [
    "Innovative Insights Expo","Reliable Solutions Showcase","Efficient Tech Symposium","Creative Minds Workshop",
    "Professional Growth Summit","Dynamic Innovations Fair","Friendly Networking Hub","Trustworthy Trends Conference",
    "Experienced Leaders Forum","Passionate Pioneers Meetup","Dedicated Developers Day","Skilled Strategists Seminar"
  ];

  const handlePastPopupClick = (pastPopup: string) => {
    setSelectedPastPopups(prevSelected =>
      prevSelected.includes(pastPopup)
        ? prevSelected.filter(item => item !== pastPopup)
        : [...prevSelected, pastPopup]
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Past Popup section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 04/05</h2>
          <h1 className="text-5xl font-bold mb-8">Which of these pop-ups have you attended in the past?</h1>
          {/* List for all adjective */}
          <div className="grid grid-cols-4 gap-4">
            {pastPopups.map((pastPopup, index) => (
              <button
                key={index}
                className={`h-12 flex items-center justify-center hover:bg-gray-400 ${selectedPastPopups.includes(pastPopup) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handlePastPopupClick(pastPopup)}
              >
                {pastPopup}
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