"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import styles from '../../styles.module.css';

export default function ProductPage() {
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(150);
  const [createOwnProducts, setCreateOwnProducts] = useState<'yes' | 'no' | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = async () => {
    updateVendor({
      ...vendor,
      priceRange: {
        min: priceMin,
        max: priceMax
      },
      createOwnProducts: createOwnProducts === 'yes'
    });

    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/create-profile/vendor/budget');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    if (type === 'min') {
      setPriceMin(Math.min(value, priceMax - 0));
    } else {
      setPriceMax(Math.max(value, priceMin + 0));
    }
  };

  return (
    <div className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}>
      <div className={styles.stepIndicator}>
        <span className={styles.stepIcon}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={`${styles.stepIcon} ${styles.active}`}>⌂</span>
        <span className={styles.stepIcon}>●</span>
        <span className={styles.stepIcon}>⟶</span>
      </div>

      <p className={styles.stepText}>Step 04/08</p>
      <h1 className={styles.title}>Tell us about your products</h1>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>What price range do you typically sell in?*</label>
          <div className={styles.priceRangeContainer}>
            <div className={styles.priceInputs}>
              <div>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  min={0}
                  max={priceMax - 0}
                  className={styles.priceInput}
                />
              </div>
              <span className={styles.priceSeparator}>to</span>
              <div>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  min={priceMin + 0}
                  max={300}
                  className={styles.priceInput}
                />
              </div>
            </div>
            <div className={styles.sliderContainer}>
              <div className={styles.sliderTrack} />
              <div
                className={styles.sliderRange}
                style={{
                  left: `${((priceMin - 0) / (300 - 0)) * 100}%`,
                  right: `${100 - ((priceMax - 0) / (300 - 0)) * 100}%`
                }}
              />
              <input
                type="range"
                min={0}
                max={300}
                value={priceMin}
                onChange={(e) => handlePriceChange(e, 'min')}
                className={styles.slider}
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                min={0}
                max={300}
                value={priceMax}
                onChange={(e) => handlePriceChange(e, 'max')}
                className={styles.slider}
                style={{ zIndex: 2 }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Do you create your own products?*</label>
          <div className={styles.pillButtonContainer}>
            <button
              className={`${styles.pillButton} ${createOwnProducts === 'yes' ? styles.selected : ''}`}
              onClick={() => setCreateOwnProducts('yes')}
              type="button"
            >
              Yes
            </button>
            <button
              className={`${styles.pillButton} ${createOwnProducts === 'no' ? styles.selected : ''}`}
              onClick={() => setCreateOwnProducts('no')}
              type="button"
            >
              No
            </button>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.nextButton}
            onClick={handleNext}
            disabled={!createOwnProducts}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}