'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface ExtendedUser extends User {
  role?: 'host' | 'vendor' | 'none';
}

interface UserContextProps {
  user: ExtendedUser | null;
  vendorProfile: any | null;
  hostProfile: any | null;
  getVendorProfile: () => Promise<void>;
  getHostProfile: () => Promise<void>;
  updateUserRole: (role: 'host' | 'vendor' | 'none') => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  vendorProfile: null,
  hostProfile: null,
  getVendorProfile: async () => {},
  getHostProfile: async () => {},
  updateUserRole: async () => {},
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
          role: userData.role || 'none',
        }));
      } else {
        // If user document doesn't exist, create it with 'none' role
        await setDoc(userDocRef, { role: 'none' });
        setUser((prevUser) => ({
          ...(prevUser as ExtendedUser),
          role: 'none',
        }));
      }
    } catch (error) {
      console.error('Error fetching/setting user role:', error);
    }
  };

  const updateUserRole = async (newRole: 'host' | 'vendor' | 'none') => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { role: newRole });
      setUser((prevUser) => ({
        ...(prevUser as ExtendedUser),
        role: newRole,
      }));
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const getVendorProfile = async () => {
    if (!user) return;
    
    try {
      const vendorProfileRef = doc(db, 'vendorProfile', user.uid);
      const vendorProfileSnap = await getDoc(vendorProfileRef);
      
      if (vendorProfileSnap.exists()) {
        setVendorProfile(vendorProfileSnap.data());
      } else {
        setVendorProfile(null);
      }
    } catch (error) {
      console.error("Error getting vendor profile: ", error);
      setVendorProfile(null);
    }
  };

  const getHostProfile = async () => {
    if (!user) return;
    
    try {
      const hostProfileRef = doc(db, 'hostProfile', user.uid);
      const hostProfileSnap = await getDoc(hostProfileRef);
      
      if (hostProfileSnap.exists()) {
        setHostProfile(hostProfileSnap.data());
      } else {
        setHostProfile(null);
      }
    } catch (error) {
      console.error("Error getting host profile: ", error);
      setHostProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const extendedUser = user as ExtendedUser;
        setUser(extendedUser);
        await fetchUserRole(user.uid);
        
        // Get the latest user data after role is fetched
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.role === 'vendor') {
            await getVendorProfile();
          } else if (userData.role === 'host') {
            await getHostProfile();
          }
        }
      } else {
        setUser(null);
        setVendorProfile(null);
        setHostProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      vendorProfile, 
      hostProfile, 
      getVendorProfile, 
      getHostProfile,
      updateUserRole
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);