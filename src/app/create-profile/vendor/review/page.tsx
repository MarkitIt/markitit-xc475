"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import { useUserContext } from '@/context/UserContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from '../../styles.module.css';
import { Vendor } from '@/types/Vendor';

export default function ReviewPage() {
  const router = useRouter();
  const { vendor } = useVendor();
  const { user, updateUserRole } = useUserContext();
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleComplete = async () => {
    try {
      if (!user || !vendor) {
        setError('User must be logged in to complete profile');
        return;
      }

      // Create a clean copy of vendor data without any undefined values
      const vendorData: Partial<Vendor> = Object.entries(vendor).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key as keyof Vendor] = value;
        }
        return acc;
      }, {} as Partial<Vendor>);

      // Handle logo upload if it's a File object
      if (vendor.logo && vendor.logo instanceof File) {
        const logoUrl = await uploadFile(
          vendor.logo,
          `vendor-logos/${user.uid}/${Date.now()}-${vendor.logo.name}`
        );
        vendorData.logo = logoUrl;
      }

      // Handle image uploads if they're File objects
      const images = vendor.images || [];
      if (images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (image, index) => {
            if (image instanceof File) {
              const fileName = `${Date.now()}-${index}-${image.name}`;
              return await uploadFile(image, `vendor-images/${user.uid}/${fileName}`);
            }
            return image; // Keep existing URLs as is
          })
        );
        vendorData.images = imageUrls.filter(url => url !== null);
      }

      // Create new vendor profile document using the user's UID as the document ID
      const vendorProfileRef = doc(db, 'vendorProfile', user.uid);
      
      // Prepare final data for Firestore
      const finalVendorData = {
        ...vendorData,
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Saving vendor data:', finalVendorData);

      // Save to Firestore
      await setDoc(vendorProfileRef, finalVendorData);

      // Update user's role in the users collection
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { role: 'vendor' }, { merge: true });

      // Update user's role in context
      await updateUserRole('vendor');

      setIsExiting(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/');
    } catch (err) {
      console.error('Error creating vendor profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating your profile');
    }
  };

  const handlePrevious = async () => {
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/create-profile/vendor/optional');
  };

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      <div className={styles.stepIndicator}>
        <span className={styles.stepIcon}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={styles.stepIcon}>⌂</span>
        <span className={styles.stepIcon}>●</span>
        <span className={styles.stepIcon}>⟶</span>
        <span className={styles.stepIcon}>✓</span>
        <span className={`${styles.stepIcon} ${styles.active}`}>👁</span>
      </div>

      <p className={styles.stepText}>Step 05/05</p>
      <h1 className={styles.title}>Review Profile</h1>
      <p className={styles.subtitle}>Please review your information before completing your profile.</p>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Business Name</label>
          <div className={styles.reviewText}>{vendor.businessName}</div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category/Industry</label>
          <div className={styles.reviewText}>{vendor.type}</div>
          <div className={styles.reviewText}>{vendor.categories?.join(', ') || 'No categories selected'}</div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Short Business Description</label>
          <div className={styles.reviewText}>{vendor.description}</div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Business Adjectives</label>
          <div className={styles.pillContainer}>
            {vendor.demographic?.map((adj, index) => (
              <span key={index} className={styles.reviewPill}>{adj}</span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Business Logo</label>
          <div className={styles.reviewText}>
            {vendor.logo 
              ? vendor.logo instanceof File 
                ? `Logo uploaded: ${vendor.logo.name}`
                : 'Logo uploaded'
              : 'No logo uploaded'
            }
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Images</label>
          <div className={styles.reviewText}>
            {(() => {
              const validImages = vendor.images?.filter(img => img instanceof File || typeof img === 'string') || [];
              return validImages.length > 0
                ? `${validImages.length} product image${validImages.length > 1 ? 's' : ''} uploaded`
                : 'No product images uploaded';
            })()}
          </div>
          {vendor.images?.map((image, index) => (
            image instanceof File ? (
              <div key={index} className={styles.reviewText}>
                Image {index + 1}: {image.name}
              </div>
            ) : null
          ))}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Attended Pop-Ups</label>
          <div className={styles.pillContainer}>
            {vendor.selectedPastPopups?.map((popup, index) => (
              <span key={index} className={styles.reviewPill}>{popup}</span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price Range</label>
          <div className={styles.reviewText}>
            ${vendor.priceRange?.min} - ${vendor.priceRange?.max}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Event Preferences</label>
          <div className={styles.pillContainer}>
            {vendor.eventPreference?.map((pref, index) => (
              <span key={index} className={styles.reviewPill}>{pref}</span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Cities</label>
          <div className={styles.pillContainer}>
            {vendor.cities?.map((city, index) => (
              <span key={index} className={styles.reviewPill}>{city}</span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Setup Information</label>
          <div className={styles.reviewText}>
            {vendor.hasOwnSetup === true ? 'Has own setup' : 
             vendor.hasOwnSetup === false ? 'Needs setup assistance' : 
             'Setup requirements depend on event'}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Budget Preferences</label>
          <div className={styles.reviewText}>
            Maximum Vendor Fee: ${vendor.budget?.maxVendorFee || 'Not specified'}
          </div>
          <div className={styles.reviewText}>
            Expected Event Spending: ${vendor.budget?.totalCostEstimate || 'Not specified'}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Schedule Preferences</label>
          <div className={styles.pillContainer}>
            {vendor.schedule?.preferredDays?.map((day, index) => (
              <span key={index} className={styles.reviewPill}>{day}</span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Additional Information</label>
          <div className={styles.reviewText}>{vendor.additionalInfo || 'No additional information provided'}</div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.secondaryButton}
            onClick={handlePrevious}
          >
            Previous
          </button>
          <button
            className={styles.nextButton}
            onClick={handleComplete}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
