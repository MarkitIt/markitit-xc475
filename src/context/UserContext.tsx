'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface UserContextProps {
  user: User | null;
  vendorProfile: any | null;
  getVendorProfile: () => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  vendorProfile: null,
  getVendorProfile: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any | null>(null);

  const getVendorProfile = () => {
    if (user) {
      const vendorProfileCollection = collection(db, 'vendorProfile');
      const q = query(vendorProfileCollection, where('uid', '==', user.uid));
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const vendorProfileData = querySnapshot.docs[0].data();
          setVendorProfile(vendorProfileData);
        }
      }).catch((error) => {
        console.error("Error getting vendor profile: ", error);
      });
    }
    console.log(user)
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getVendorProfile();
      } else {
        setUser(null);
        setVendorProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, vendorProfile, getVendorProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);