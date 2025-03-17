"use client";

import { onAuthStateChanged, User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBusinessAdjectiveContext } from '../../../context/BusinessAdjectiveContext';
import { useBusinessLogoContext } from '../../../context/BusinessLogoContext';
import { useBusinessPastPopupContext } from '../../../context/BusinessPastPopupContext';
import { useBusinessProfileContext } from '../../../context/BusinessProfileContext';
import { useUserContext } from '../../../context/UserContext';
import { auth, db } from '../../../lib/firebase';
import '../../tailwind.css';

const BusinessFinished = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { getVendorProfile } = useUserContext();
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
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);



  const handleNextStepClick = async () => {
    // Prepare the data to be sent to the backend
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const data = {
      uid: user.uid,
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
      instagramHandle,
      selectedAdjectives,
      selectedPastPopups,
      images: images.map(image => image.name) // Assuming you will handle image uploads separately
    };

    try {
      // Save the data to Firestore
      const docRef = await addDoc(collection(db, 'vendorProfile'), data);
      console.log('Document written with ID: ', docRef.id);

      // Reload the header to reflect the latest data
      getVendorProfile();

      // Redirect to the home page after successful submission
      router.push('/');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
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

          <h1 className="text-3xl font-bold mb-8 mt-2">Profile</h1>
          <div className="">Business name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={businessName}
              disabled
            />

            <div className="">Legal business name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={legalBusinessName}
              disabled
            />

            <div className="">Contact legal name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={contactLegalName}
              disabled
            />

            <div className="">Contact preferred name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={contactPreferredName}
              disabled
            />

            <div className="">Country/region</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={country}
              disabled
            />

            <div className="">Street address</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={streetAddress}
              disabled
            />

            <div className="">Apt, suite. (optional)</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={aptSuite}
              disabled
            />  

            <div className="">City</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={city}
              disabled
            />

            <div className="">State/province</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={stateProvince}
              disabled
            />

            <div className="">Zip/postal code</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={zipPostalCode}
              disabled
            />

            <div className="">Email</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={email}
              disabled
            />    

            <div className="">Phone</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={phone}
              disabled
            />    

            <div className="">Website</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={website}
              disabled
            />    

            <div className="">Number of employees</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={numberOfEmployees}
              disabled
            />    

            <div className="">Description</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={description}
              disabled
            />   

            <div className="">Facebook link</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={facebookLink}
              disabled
            />   

            <div className="">Twitter "X" handle</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={twitterHandle}
              disabled
            />   

            <div className="">Instagram handle</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
              placeholder={instagramHandle}
              disabled
            />   

          <h1 className="text-3xl font-bold mb-8 mt-2">Adjectives</h1>
          <div className="grid grid-cols-4 gap-4">
            {selectedAdjectives.map((adjective, index) => (
              <button
                key={index}
                className={`h-12 flex items-center justify-center pointer-events-none ${selectedAdjectives.includes(adjective) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {adjective}
              </button>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-8 mt-2">Uploaded Images</h1>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="w-full h-32 bg-gray-200 flex items-center justify-center">
                <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} className="max-h-full max-w-full" />
              </div>
            ))}
          </div>


          <h1 className="text-3xl font-bold mb-8 mt-2">Past Popups</h1>
          <div className="grid grid-cols-4 gap-4">
            {selectedPastPopups.map((pastPopup, index) => (
              <button
                key={index}
                className={`h-12 flex items-center justify-center pointer-events-none ${selectedPastPopups.includes(pastPopup) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {pastPopup}
              </button>
            ))}
          </div>

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