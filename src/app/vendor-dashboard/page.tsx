
"use client";
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Adjust the import based on your project structure

const VendorDashboard = () => {
  const [userName, setUserName] = useState<string | null>(null); // State to store the user's name

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log("User UID:", user.uid); // Log the user's UID
        setUserName(user.email); // Set the user's display name
        console.log("User object:", user); // Log the entire user object
      } else {
        // No user is signed in
        console.log("No user is signed in.");
        setUserName(null); // Reset the user name
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <main className="p-8">
        <h2 className="text-2xl font-semibold mb-4">
          {userName ? `Welcome to your dashboard, ${userName}!` : 'Please sign in.'}
        </h2>
        <p className="mb-4">Here you can manage your vendor profile, view applications, and more.</p>
        <nav className="space-y-2">
          {/* Navigation links can go here */}
        </nav>
      </main>
    </div>
  );
};

export default VendorDashboard;