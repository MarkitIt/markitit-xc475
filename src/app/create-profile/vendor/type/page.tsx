"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import styles from "../../styles.module.css";

export default function typePage() {
  const router = useRouter();
  //const { vendor, setVendor } = useVendor();
  const { vendor, updateVendor } = useVendor();
  const [selectedType, setSelectedType] = useState<"food" | "market" | null>(
    null,
  );
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = async () => {
    if (!selectedType) return;

    updateVendor({
      ...vendor,
      type: selectedType,
    });

    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/create-profile/vendor/category");
  };

  return (
    <div
      className={`${styles.container} ${isExiting ? styles.slideOut : styles.slideIn}`}
    >
      <div className={styles.stepText}>Step 02/08</div>
      <h1 className={`${styles.title} ${styles.centeredTitle}`}>
        What type of vendor are you?
      </h1>

      <div className={styles.pillButtonContainer}>
        <button
          className={`${styles.pillButton} ${selectedType === "food" ? styles.selected : ""}`}
          onClick={() => setSelectedType("food")}
        >
          Food Vendor
        </button>
        <button
          className={`${styles.pillButton} ${selectedType === "market" ? styles.selected : ""}`}
          onClick={() => setSelectedType("market")}
        >
          Market Vendor
        </button>
      </div>

      <button
        className={styles.nextButton}
        onClick={handleNext}
        disabled={!selectedType}
      >
        Next Step
      </button>
    </div>
  );
}
