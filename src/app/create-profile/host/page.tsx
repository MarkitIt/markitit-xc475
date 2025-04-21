'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, setDoc,updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUserContext } from '@/context/UserContext';
import styles from '../styles.module.css';

interface HostProfile {
  organizationName: string;
  organizationDescription: string;
  contactEmail: string;
  phoneNumber: string;
  website: string;
  eventTypes: string[];
  eventCapacity: string;
}

export default function HostProfilePage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isExiting, setIsExiting] = useState(false);

  const [hostProfile, setHostProfile] = useState<HostProfile>({
    organizationName: '',
    organizationDescription: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    eventTypes: [],
    eventCapacity: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHostProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a host profile.');
      return;
    }

    try {
      const hostProfileData = {
        ...hostProfile,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      };

      // Save the host profile data to Firestore
      await setDoc(doc(db, 'hostProfile', user.uid), hostProfileData);

      alert('Host profile created successfully!');

      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
      await updateDoc(userDocRef, { role: "host" }); // Update the role field
      

      setIsExiting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error creating host profile:', error);
      alert('An error occurred while creating your profile. Please try again.');
    }
  };

  return (
    <div className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}>

      <h1 className={styles.title}>Create Host Profile</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Organization Name*</label>
          <input
            type="text"
            name="organizationName"
            className={styles.input}
            value={hostProfile.organizationName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Organization Description*</label>
          <textarea
            name="organizationDescription"
            className={styles.textarea}
            value={hostProfile.organizationDescription}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Email*</label>
          <input
            type="email"
            name="contactEmail"
            className={styles.input}
            value={hostProfile.contactEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number*</label>
          <input
            type="tel"
            name="phoneNumber"
            className={styles.input}
            value={hostProfile.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Website*</label>
          <input
            type="url"
            name="website"
            className={styles.input}
            value={hostProfile.website}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Event Types*</label>
          <select
            name="eventTypes"
            className={styles.select}
            value={hostProfile.eventTypes}
            onChange={(e) =>
              setHostProfile((prev) => ({
                ...prev,
                eventTypes: Array.from(e.target.selectedOptions, (option) => option.value),
              }))
            }
            multiple
            required
          >
            <option value="market">Markets</option>
            <option value="fair">Fairs</option>
            <option value="festival">Festivals</option>
            <option value="popup">Pop-up Events</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Typical Event Capacity*</label>
          <select
            name="eventCapacity"
            className={styles.input}
            value={hostProfile.eventCapacity}
            onChange={handleChange}
            required
          >
            <option value="">Select capacity range</option>
            <option value="small">Small (1-20 vendors)</option>
            <option value="medium">Medium (21-50 vendors)</option>
            <option value="large">Large (51-100 vendors)</option>
            <option value="xlarge">Extra Large (100+ vendors)</option>
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.backButton}
          >
            Back
          </button>
          <button type="submit" className={styles.nextButton}>
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
}