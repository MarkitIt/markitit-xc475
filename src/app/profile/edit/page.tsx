"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import styles from '../styles.module.css';

const EVENT_SIZE_OPTIONS = [
  { label: "Small (under 25 vendors)", value: "small", min: 1, max: 25 },
  { label: "Medium (25–75 vendors)", value: "medium", min: 25, max: 75 },
  { label: "Large (75–150 vendors)", value: "large", min: 75, max: 150 },
  { label: "Mega Events (150+ vendors / festivals)", value: "mega", min: 150, max: Infinity }
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const vendorDoc = await getDoc(doc(db, 'vendorProfile', user.uid));
          if (vendorDoc.exists()) {
            const data = vendorDoc.data();
            setProfileData(data);
            setSelectedDays(data.schedule?.preferredDays || []);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDayChange = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });

    setProfileData((prev: any) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        preferredDays: selectedDays.includes(day) 
          ? selectedDays.filter(d => d !== day)
          : [...selectedDays, day]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'vendorProfile', auth.currentUser.uid), {
        description: profileData.description,
        instagram: profileData.instagram,
        facebook: profileData.facebook,
        etsy: profileData.etsy,
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
        website: profileData.website,
        additionalInfo: profileData.additionalInfo,
        eventPreference: profileData.eventPreference,
        preferredEventSize: profileData.preferredEventSize,
        schedule: {
          ...profileData.schedule,
          preferredDays: selectedDays
        }
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!profileData) {
    return <div className={styles.error}>Profile not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Business Information</h2>
          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea
              value={profileData.description || ''}
              onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
              className={styles.textarea}
              placeholder="Describe your business..."
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>
          <div className={styles.inputGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={profileData.phoneNumber || ''}
              onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
              className={styles.input}
              placeholder="Phone number"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={profileData.email || ''}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className={styles.input}
              placeholder="Email"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Website</label>
            <input
              type="url"
              value={profileData.website || ''}
              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              className={styles.input}
              placeholder="Website URL"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Social Media</h2>
          <div className={styles.inputGroup}>
            <label>Instagram</label>
            <input
              type="url"
              value={profileData.instagram || ''}
              onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
              className={styles.input}
              placeholder="Instagram URL"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Facebook</label>
            <input
              type="url"
              value={profileData.facebook || ''}
              onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
              className={styles.input}
              placeholder="Facebook URL"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Etsy</label>
            <input
              type="url"
              value={profileData.etsy || ''}
              onChange={(e) => setProfileData({ ...profileData, etsy: e.target.value })}
              className={styles.input}
              placeholder="Etsy URL"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Event Preferences</h2>
          <div className={styles.inputGroup}>
            <label>Preferred Event Types</label>
            <input
              type="text"
              value={profileData.eventPreference?.join(', ') || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                eventPreference: e.target.value.split(',').map(s => s.trim())
              })}
              className={styles.input}
              placeholder="Comma-separated list of event types"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Preferred Event Size</label>
            <select
              value={EVENT_SIZE_OPTIONS.find(opt => 
                opt.min === profileData.preferredEventSize?.min && 
                opt.max === profileData.preferredEventSize?.max
              )?.value || ''}
              onChange={(e) => {
                const selected = EVENT_SIZE_OPTIONS.find(opt => opt.value === e.target.value);
                setProfileData({
                  ...profileData,
                  preferredEventSize: {
                    min: selected?.min || 0,
                    max: selected?.max || 0
                  }
                });
              }}
              className={styles.select}
            >
              <option value="">Select event size</option>
              {EVENT_SIZE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Preferred Days</label>
            <div className={styles.checkboxGroup}>
              {DAYS_OF_WEEK.map(day => (
                <label key={day} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className={styles.checkbox}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Additional Information</h2>
          <div className={styles.inputGroup}>
            <textarea
              value={profileData.additionalInfo || ''}
              onChange={(e) => setProfileData({ ...profileData, additionalInfo: e.target.value })}
              className={styles.textarea}
              placeholder="Add any additional information about your business..."
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" onClick={() => router.push('/profile')} className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={styles.saveButton}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 