"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useVendor } from "@/context/VendorContext";
import styles from "../../styles.module.css";

export default function Optional() {
  const [eventPriorityFactors, setEventPriorityFactors] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const { vendor, updateVendor } = useVendor();
  const [isExiting, setIsExiting] = useState(false);

  const priorityOptions = [
    "Expected Attendance & Event Size",
    "Costs",
    "Location",
    "Target Audience",
    "Positive Host Reviews",
    "Vendor Count (Competition)",
  ];

  // Synchronize form data with vendor context
  useEffect(() => {
    if (vendor) {
      setEventPriorityFactors(vendor.eventPriorityFactors || []);
      setAdditionalInfo(vendor.additionalInfo || "");
    }
  }, [vendor]);

  const handlePriorityChange = (option: string) => {
    setEventPriorityFactors((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (eventPriorityFactors.length === 0) {
      alert("Please select at least one priority factor.");
      return;
    }

    const formData = {
      eventPriorityFactors,
      additionalInfo,
    };

    updateVendor(formData);
    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/create-profile/vendor/review");
  };

  return (
    <div className={styles.contentContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Optional Information</h1>
        <p className={styles.subtitle}>
          Share additional details to help us better understand your needs
        </p>

        {/* Priority Factors Section */}
        <div className={styles.formGroup}>
          <h2 className={styles.sectionTitle}>
            What factors do you prioritize when selecting events?
          </h2>
          <div className={styles.checkboxGrid}>
            {priorityOptions.map((option) => (
              <div key={option} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id={option.replace(/\s+/g, "-").toLowerCase()}
                  checked={eventPriorityFactors.includes(option)}
                  onChange={() => handlePriorityChange(option)}
                  className={styles.checkbox}
                />
                <label htmlFor={option.replace(/\s+/g, "-").toLowerCase()}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className={styles.formGroup}>
          <label htmlFor="additionalInfo" className={styles.label}>
            Additional Information
          </label>
          <textarea
            id="additionalInfo"
            className={styles.textarea}
            placeholder="Share anything else you'd like us to know about your business or preferences"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
}