"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import styles from "../../styles.module.css";

export default function OptionalPage() {
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleNext = async () => {
    updateVendor({
      additionalInfo: additionalInfo.trim(),
    });

    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/create-profile/vendor/review");
  };

  return (
    <div
      className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}
    >
      <div className={styles.stepIndicator}>
        <span className={styles.stepIcon}>▲</span>
        <span className={styles.stepIcon}>★</span>
        <span className={styles.stepIcon}>⌂</span>
        <span className={styles.stepIcon}>●</span>
        <span className={styles.stepIcon}>⟶</span>
        <span className={`${styles.stepIcon} ${styles.active}`}>✓</span>
      </div>

      <p className={styles.stepText}>Optional Step 08/08</p>
      <h1 className={styles.title}>Additional Information</h1>
      <p className={styles.subtitle}>
        Anything else we missed? Feel free to add anything you want us or event
        hosts to know.
      </p>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <textarea
            className={styles.textarea}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Share any additional details about your business..."
            rows={6}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.nextButton} onClick={handleNext}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
