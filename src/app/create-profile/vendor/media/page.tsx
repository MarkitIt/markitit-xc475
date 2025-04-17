"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import styles from '../../styles.module.css';

export default function MediaPage() {
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [images, setImages] = useState<{ id: number; file: File | null }[]>([
    { id: 1, file: null },
    { id: 2, file: null }
  ]);

  useEffect(() => {
    // Initialize with existing data if available
    if (vendor?.logo instanceof File) {
      setLogo(vendor.logo);
    }
    
    const existingImages = vendor?.images || [];
    if (existingImages.length > 0) {
      setImages(existingImages.map((file, index) => ({
        id: index + 1,
        file: file instanceof File ? file : null
      })));
    }
  }, [vendor]);

  const handleLogoChange = (file: File | null) => {
    setLogo(file);
  };

  const handleImageChange = (id: number, file: File | null) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, file } : img
      )
    );
  };

  const handleAddImage = () => {
    if (images.length >= 5) return;
    const newId = Math.max(...images.map(img => img.id)) + 1;
    setImages([...images, { id: newId, file: null }]);
  };

  const handleNext = async () => {
    // Update vendor context with files
    const validImages = images
      .map(img => img.file)
      .filter((file): file is File => file !== null);

    updateVendor({
      logo: logo || undefined,
      images: validImages.length > 0 ? validImages : undefined
    });

    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/create-profile/vendor/optional');
  };

  return (
    <div className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}>
      <div className={styles.stepIndicator}>
        <span className={styles.stepIcon}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={styles.stepIcon}>⌂</span>
        <span className={styles.stepIcon}>●</span>
        <span className={`${styles.stepIcon} ${styles.active}`}>⟶</span>
      </div>

      <p className={styles.stepText}>Step 07/08</p>
      <h1 className={styles.title}>Upload your brand assets:</h1>
      <p className={styles.subtitle}>High quality images help you stand out.</p>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Business Logo</label>
          <p className={styles.helperText}>This will be displayed on your profile and in search results.</p>
          <label className="upload-image-container" htmlFor="logo-upload">
            <div className="upload-icon">↑</div>
            <span className="upload-text">
              {logo ? logo.name : 'Upload Logo'}
            </span>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoChange(e.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Product Images (Max 5)</label>
          <p className={styles.helperText}>Show off your products with clear, well-lit photos.</p>
        </div>

        {images.map((image, index) => (
          <div key={image.id} className={styles.formGroup}>
            <label className={styles.label}>Image #{index + 1}</label>
            <label className="upload-image-container" htmlFor={`image-${image.id}`}>
              <div className="upload-icon">↑</div>
              <span className="upload-text">
                {image.file ? image.file.name : 'Upload Image'}
              </span>
            </label>
            <input
              id={`image-${image.id}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(image.id, e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </div>
        ))}

        {images.length < 5 && (
          <button
            type="button"
            onClick={handleAddImage}
            className={styles.secondaryButton}
          >
            + Add Image
          </button>
        )}

        <div className={styles.buttonContainer}>
          <button
            className={styles.nextButton}
            onClick={handleNext}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}
