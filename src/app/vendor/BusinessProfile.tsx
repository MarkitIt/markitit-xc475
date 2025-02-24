import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from 'next/router';
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

//   if (loading) {
//     return <div>Loading...</div>;
//   }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center p-6 border-b bg-white shadow-sm">
        <h1 className="text-4xl font-bold">Markitit</h1>
        <nav className="flex space-x-12">
          <a href="#" className="text-gray-600 text-lg">Ipsum</a>
          <a href="#" className="text-gray-600 text-lg">Ipsum</a>
          <a href="#" className="text-gray-600 text-lg">Ipsum</a>
        </nav>
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 text-xl">🔍</button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-lg">Profile</span>
            <button className="text-gray-600 text-lg">▼</button>
          </div>
        </div>
      </header>

      <main className="p-16 flex space-x-16">
        <div className="w-[40%] h-[450px] bg-gray-300 rounded-lg"></div>
        <div className="w-[60%]">
          <h2 className="text-md text-gray-500">Step 01/05</h2>
          <h1 className="text-5xl font-bold mb-8">Create Business Profile</h1>
          <div className="space-y-6">
            <div className="w-full h-14 bg-gray-300 rounded-lg"></div>
            <div className="w-full h-14 bg-gray-300 rounded-lg"></div>
            <div className="w-full h-14 bg-gray-300 rounded-lg"></div>
            <div className="w-full h-14 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 rounded-lg">Helps</div>
            <div className="w-48 h-14 bg-gray-300 rounded-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
              onClick={() => router.push('/vendor/BusinessAdjective')}>Next Step</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessProfile;