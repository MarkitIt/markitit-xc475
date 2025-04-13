"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '../styles.module.css';
/*
* Business Name
* Contact Name
* Email
* Phone Number
* Website / Instagram / Etsy (any that apply)
* Business Address / City & State
*/
export default function VendorProfilePage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [etsy, setEtsy] = useState('');
  const [facebook, setFacebook] = useState('');
  /*
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName && contactName && email && phoneNumber && website && instagram) {
      router.push('/create-profile/vendor/businessProducts/businessType');
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        <span className={`${styles.stepIcon} ${styles.active}`}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={styles.stepIcon}>⌂</span>
        <span className={styles.stepIcon}>●</span>
        <span className={styles.stepIcon}>⟶</span>
      </div>

      <p className={styles.stepText}>Step 01/05</p>
      <h1 className={styles.title}>Create Business Profile</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Business Name*</label>
          <input
            type="text"
            className={styles.input}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Name*</label>
          <input
            type="text"
            className={styles.input}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email*</label>
          <input
            type="text"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number*</label>
          <input
            type="text"
            className={styles.input}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Website*</label>
          <input
            type="text"
            className={styles.input}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram Link*</label>
          <p className={styles.description}>Enter your Instagram Profile link</p>
          <input
            type="text"
            className={styles.input}
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Facebook Link</label>
          <p className={styles.description}>Enter your Facebook Profile link</p>
          <input
            type="text"
            className={styles.input}
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Etsy Link</label>
          <p className={styles.description}>Enter your Etsy Profile link</p>
          <input
            type="text"
            className={styles.input}
            value={etsy}
            onChange={(e) => setEtsy(e.target.value)}
          />
        </div>


        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            Next Steps
          </button>
        </div>
      </form>
    </div>
  );
}