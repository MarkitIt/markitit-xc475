'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface UserContextProps {
  user: User | null;
  vendorProfile: any | null;
  reloadHeader: () => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  vendorProfile: null,
  reloadHeader: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any | null>(null);

  const reloadHeader = async () => {
    if (user) {
      const vendorProfileCollection = collection(db, 'vendorProfile');
      const q = query(vendorProfileCollection, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const vendorProfileData = querySnapshot.docs[0].data();
        setVendorProfile(vendorProfileData);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        reloadHeader();
      } else {
        setUser(null);
        setVendorProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, vendorProfile, reloadHeader }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);