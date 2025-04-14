'use client';

import { useState, useEffect } from 'react';
import styles from '../styles.module.css';
import { SettingsNavigation } from '../components/SettingsNavigation';
import { ProfileSettingsHost } from './components/ProfileSettingsHost';
import { getDoc, doc,setDoc } from 'firebase/firestore';
import { useUserContext } from '@/context/UserContext';
import { db } from '@/lib/firebase';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const { user } = useUserContext();
  const [hostProfile, setHostProfile] = useState<{
    email: string;
    contactEmail: string;
    createdAt: string;
    eventCapacity: string;
    eventTypes: string[];
    organizationDescription: string;
    organizationName: string;
    phoneNumber: string;
    uid: string;
    website: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHostProfile = async () => {
      if (!user) {
        console.warn("User is not logged in.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const hostProfileRef = doc(db, 'hostProfile', user.uid);
        const hostProfileSnap = await getDoc(hostProfileRef);

        if (hostProfileSnap.exists()) {
          setHostProfile(hostProfileSnap.data() as typeof hostProfile);
        } else {
          console.error('Host profile not found');
          setError('Host profile not found');
        }
      } catch (err) {
        console.error('Error fetching host profile:', err);
        setError('Failed to fetch host profile');
      } finally {
        setLoading(false);
      }
    };

    fetchHostProfile();
  }, [user]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleProfileSave = async (data: {
    phoneNumber: string;
    organizationDescription: string;
    eventCapacity: string;
    eventTypes: string[];
    website: string;
    organizationName: string;
    contactEmail: string;
  }) => {
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
  
    try {
      const hostProfileRef = doc(db, 'hostProfile', user.uid); // Reference to the host profile document
      await setDoc(hostProfileRef, data, { merge: true }); // Save the data to Firestore, merging with existing fields
      console.log('Profile data saved successfully:', data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile data:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.layout}>
        <SettingsNavigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {activeSection === 'profile' && hostProfile && (
          <ProfileSettingsHost
            initialData={{
              organizationName: hostProfile.organizationName,
              contactEmail: hostProfile.contactEmail,
              phoneNumber: hostProfile.phoneNumber,
              organizationDescription: hostProfile.organizationDescription,
              eventCapacity: hostProfile.eventCapacity,
              eventTypes: hostProfile.eventTypes,
              website: hostProfile.website,
            }}
            onSave={handleProfileSave}
          />
        )}

        {/* Add other sections as needed */}
      </div>
    </main>
  );
}