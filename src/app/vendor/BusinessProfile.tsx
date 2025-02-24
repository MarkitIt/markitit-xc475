import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from 'next/router';
import Header from '../header';
import '../tailwind.css';

// Define the type for the profile data
interface Profile {
  id: string;
  name: string;
  description: string;
}

const BusinessProfile = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, "businessProfiles"));
      const profilesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      setProfiles(profilesData);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value);
  };

  const handleLegalBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLegalBusinessName(e.target.value);
  };

  const handleNextStepClick = () => {
    if (businessName) {
      router.push('/vendor/BusinessAdjective');
    } else {
      alert("Please fill in all required fields.");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="p-16 flex space-x-16">
        <div className="w-[40%] h-[450px] bg-gray-300"></div>
        <div className="w-[60%]">
          <h2 className="text-md text-gray-500">Step 01/05</h2>
          <h1 className="text-5xl font-bold mb-8">Create Business Profile</h1>
          <div className="space-y-6">
            <div className="mt-0">Business name</div>
            <input
              className="w-[70%] h-14 bg-gray-300 mt-2"
              value={businessName}
              onChange={handleBusinessNameChange}
              required
            />
            <div className="">Legal Business name</div>
            <input
              className="w-full h-14 bg-gray-300 "
              value={legalBusinessName}
              onChange={handleLegalBusinessNameChange}
              required
            />
          </div>
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

export default BusinessProfile;