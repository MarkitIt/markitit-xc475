'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles.module.css';
import { theme } from '@/styles/theme';
import { useVendor } from '@/context/VendorContext';

export default function BudgetPage() {
  const router = useRouter();
  const [vendorFee, setVendorFee] = useState('');
  const [eventSpending, setEventSpending] = useState('');
  const [error, setError] = useState('');
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateVendor({
      budget: {
        maxVendorFee: Number(vendorFee),
        totalCostEstimate: Number(eventSpending)
      }
    });
  
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/create-profile/vendor/preferences');
  };

  return (
    <div className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}>
      <div className={styles.container}>
      <p className={styles.stepText}>Step 05/08</p>
        <h1 className={styles.title}>Budget Preferences</h1>
        
        {error && (
          <div style={{
            color: theme.colors.primary.coral,
            marginBottom: theme.spacing.xl,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              What is the maximum vendor fee you would pay?
            </label>
            <input
              type="number"
              className={styles.input}
              placeholder="e.g., $150, $500, $1000+, etc."
              value={vendorFee}
              onChange={(e) => setVendorFee(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              What do you typically expect to spend on an event?
            </label>
            <input
              type="number"
              className={styles.input}
              placeholder="e.g., $150, $500, $1000+, etc."
              value={eventSpending}
              onChange={(e) => setEventSpending(e.target.value)}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.nextButton}
              disabled={!vendorFee || !eventSpending}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
