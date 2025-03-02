"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useBusinessProfileContext } from '../../../context/BusinessProfileContext';
import { useBusinessAdjectiveContext } from '../../../context/BusinessAdjectiveContext';
import { useBusinessLogoContext } from '../../../context/BusinessLogoContext';
import { useBusinessPastPopupContext } from '../../../context/BusinessPastPopupContext';
import '../../tailwind.css';

const BusinessFinished = () => {
  const router = useRouter();
  const {
    businessName,
    legalBusinessName,
    contactLegalName,
    contactPreferredName,
    country,
    streetAddress,
    aptSuite,
    city,
    stateProvince,
    zipPostalCode,
    email,
    phone,
    website,
    numberOfEmployees,
    description,
    facebookLink,
    twitterHandle,
    instagramHandle
  } = useBusinessProfileContext();
  const { selectedAdjectives } = useBusinessAdjectiveContext();
  const { images } = useBusinessLogoContext();
  const { selectedPastPopups } = useBusinessPastPopupContext();
  

  const handleNextStepClick = () => {
    router.push('/');
    // This is where you would save the data to the database
  };

  const popups = [
    "Innovative Insights Expo","Reliable Solutions Showcase","Efficient Tech Symposium","Creative Minds Workshop",
    "Professional Growth Summit","Dynamic Innovations Fair","Friendly Networking Hub","Trustworthy Trends Conference",
    "Experienced Leaders Forum","Passionate Pioneers Meetup","Dedicated Developers Day","Skilled Strategists Seminar"
  ];


  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Past Popup section */}
        <div className="w-[50%]">
          <h2 className="text-md text-gray-500">Step 05/05</h2>
          <h1 className="text-5xl font-bold mb-8">Final review</h1>

          <h1 className="text-5xl font-bold mb-8">Review Business Name:</h1>
          <p className="text-lg">Business Name: {businessName}</p>
          <p className="text-lg">Legal Business Name: {legalBusinessName}</p>
          <p className="text-lg">Contact Legal Name: {contactLegalName}</p>
          <p className="text-lg">Contact Preferred Name: {contactPreferredName}</p>
          <p className="text-lg">Country: {country}</p>
          <p className="text-lg">Street Address: {streetAddress}</p>
          <p className="text-lg">Apt/Suite: {aptSuite}</p>
          <p className="text-lg">City: {city}</p>
          <p className="text-lg">State/Province: {stateProvince}</p>
          <p className="text-lg">Zip/Postal Code: {zipPostalCode}</p>
          <p className="text-lg">Email: {email}</p>
          <p className="text-lg">Phone: {phone}</p>
          <p className="text-lg">Website: {website}</p>
          <p className="text-lg">Number of Employees: {numberOfEmployees}</p>
          <p className="text-lg">Description: {description}</p>
          <p className="text-lg">Facebook Link: {facebookLink}</p>
          <p className="text-lg">Twitter Handle: {twitterHandle}</p>
          <p className="text-lg">Instagram Handle: {instagramHandle}</p>

          <h1 className="text-5xl font-bold mb-8">Review Selected Adjectives:</h1>
          <ul>
            {selectedAdjectives.map((adjective, index) => (
              <li key={index} className="text-lg">{adjective}</li>
            ))}
          </ul>

          <h1 className="text-5xl font-bold mb-8">Uploaded Images:</h1>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="w-full h-32 bg-gray-200 flex items-center justify-center">
                <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} className="max-h-full max-w-full" />
              </div>
            ))}
          </div>

          <h1 className="text-5xl font-bold mb-8">Past Popups:</h1>
          <ul>
            {selectedPastPopups.map((popup, index) => (
              <li key={index} className="text-lg">{popup}</li>
            ))}
          </ul>

          {/* Complete click */}
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
            <div
              className="w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
              onClick={handleNextStepClick}
            >
              Complete
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessFinished;