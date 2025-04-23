"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../styles.module.css";
import { useVendor } from "@/context/VendorContext";
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
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: vendor?.businessName || "",
    contactName: vendor?.contactName || "",
    email: vendor?.email || "",
    phoneNumber: vendor?.phoneNumber || "",
    website: vendor?.website || "",
    instagram: vendor?.instagram || "",
    etsy: vendor?.etsy || "",
    facebook: vendor?.facebook || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.businessName &&
      formData.contactName &&
      formData.email &&
      formData.phoneNumber &&
      formData.website &&
      formData.instagram
    ) {
      // Update vendor context
      updateVendor(formData);

      setIsExiting(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push("/create-profile/vendor/type");
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div
      className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}
    >
      <div className={styles.stepIndicator}>
        <span className={`${styles.stepIcon} ${styles.active}`}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={styles.stepIcon}>⌂</span>
        <span className={styles.stepIcon}>●</span>
        <span className={styles.stepIcon}>⟶</span>
      </div>

      <p className={styles.stepText}>Step 01/08</p>
      <h1 className={styles.title}>Create Business Profile</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Business Name*</label>
          <input
            type="text"
            name="businessName"
            className={styles.input}
            value={formData.businessName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Name*</label>
          <input
            type="text"
            name="contactName"
            className={styles.input}
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email*</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
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
            value={formData.phoneNumber}
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
            value={formData.website}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Instagram Link*</label>
          <p className={styles.description}>
            Enter your Instagram Profile link
          </p>
          <input
            type="url"
            name="instagram"
            className={styles.input}
            value={formData.instagram}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Facebook Link</label>
          <p className={styles.description}>Enter your Facebook Profile link</p>
          <input
            type="url"
            name="facebook"
            className={styles.input}
            value={formData.facebook}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Etsy Link</label>
          <p className={styles.description}>Enter your Etsy Profile link</p>
          <input
            type="url"
            name="etsy"
            className={styles.input}
            value={formData.etsy}
            onChange={handleChange}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.nextButton}>
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
}
