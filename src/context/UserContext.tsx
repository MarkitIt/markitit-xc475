'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface ExtendedUser extends User {
  role?: string;
}

interface UserContextProps {
  user: ExtendedUser | null;
  vendorProfile: any | null;
  getVendorProfile: () => void;
  hostProfile: any | null;
  getHostProfile: () => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  vendorProfile: null,
  getVendorProfile: () => {},
  hostProfile: null,
  getHostProfile: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any | null>(null);
  const [hostProfile, setHostProfile] = useState<any | null>(null);

  const fetchUserRole = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUser((prevUser) => ({
          ...(prevUser as ExtendedUser),
          role: userData.role, // Add the role to the user object
        }));
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const getVendorProfile = () => {
    if (user) {
      console.log("vendor exist")
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

  const getHostProfile = () => {
    if (user) {
      console.log("host exist")
      const hostProfileCollection = collection(db, 'hostProfile');
      const q = query(hostProfileCollection, where('uid', '==', user.uid));
      getDocs(q).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const hostProfileData = querySnapshot.docs[0].data();
          console.log(hostProfileData)
          setHostProfile(hostProfileData);
        }
      }).catch((error) => {
        console.error("Error getting host profile: ", error);
      });
    }
    console.log(user)
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user as ExtendedUser);
        fetchUserRole(user.uid);
        getVendorProfile();
        getHostProfile();
      } else {
        setUser(null);
        setVendorProfile(null);
        setHostProfile(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, vendorProfile, getVendorProfile, hostProfile, getHostProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);