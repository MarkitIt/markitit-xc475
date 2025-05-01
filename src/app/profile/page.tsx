"use client";

import { useEffect, useState } from 'react';
import VendorProfileView from './components/VendorProfileView';
import HostProfileView from './components/HostProfileView';
import styles from './styles.module.css';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';

interface UserProfile {
  role: 'vendor' | 'host';
  uid: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileOwner, setIsProfileOwner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setCurrentUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile: UserProfile = {
              role: userData.role as 'vendor' | 'host',
              uid: firebaseUser.uid
            };
            setUser(userProfile);

            if (userProfile.role === 'vendor') {
              const vendorDoc = await getDoc(doc(db, 'vendorProfile', userProfile.uid));
              if (vendorDoc.exists()) {
                setProfileData(vendorDoc.data());
                // Check if current user is viewing their own profile
                setIsProfileOwner(firebaseUser.uid === userProfile.uid);
              }
            } else {
              const hostDoc = await getDoc(doc(db, 'hostProfile', userProfile.uid));
              if (hostDoc.exists()) {
                setProfileData(hostDoc.data());
                // Check if current user is viewing their own profile
                setIsProfileOwner(firebaseUser.uid === userProfile.uid);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      } else {
        setUser(null);
        setProfileData(null);
        setIsProfileOwner(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user || !profileData) {
    return <div className={styles.error}>Please sign in to view your profile</div>;
  }

  // Determine if private sections should be shown
  const showPrivateSections = isProfileOwner || currentUser?.uid === user.uid;

  return (
    <div className={styles.container}>
      {user.role === 'vendor' ? (
        <VendorProfileView 
          vendorProfile={profileData} 
          showPrivateSections={showPrivateSections}
          isProfileOwner={isProfileOwner}
        />
      ) : (
        <HostProfileView 
          hostProfile={profileData} 
          showPrivateSections={showPrivateSections}
        />
      )}
    </div>
  );
}
