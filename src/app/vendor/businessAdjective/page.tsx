"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import '../../tailwind.css';


const BusinessAdjective = () => {
  const router = useRouter();
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([]);

  const handleNextStepClick = () => {
    router.push('/vendor/businessLogo');
    // This is where you would save the data to the database
  };

  const adjectives = [
    "Innovative", "Reliable", "Efficient", "Creative", "Professional", "Dynamic", "Friendly", "Trustworthy", "Experienced", "Passionate", "Dedicated", "Skilled"
  ];

  const handleAdjectiveClick = (adjective: string) => {
    setSelectedAdjectives(prevSelected =>
      prevSelected.includes(adjective)
        ? prevSelected.filter(item => item !== adjective)
        : [...prevSelected, adjective]
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Adjective section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 02/05</h2>
          <h1 className="text-5xl font-bold mb-8">Which adjectives describe your business the best?</h1>
          {/* List for all adjective */}
          <div className="grid grid-cols-4 gap-4">
            {adjectives.map((adjective, index) => (
              <button
                key={index}
                className={`h-12 flex items-center justify-center hover:bg-gray-400 ${selectedAdjectives.includes(adjective) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handleAdjectiveClick(adjective)}
              >
                {adjective}
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

export default BusinessAdjective;