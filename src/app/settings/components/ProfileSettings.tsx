import { useState } from "react";
import styles from "../styles.module.css";

interface ProfileSettingsProps {
  initialData?: {
    displayName: string;
    email: string;
  };
  onSave: (data: { displayName: string; email: string }) => void;
}

export const ProfileSettings = ({
  initialData,
  onSave,
}: ProfileSettingsProps) => {
  const [formData, setFormData] = useState({
    displayName: initialData?.displayName || "",
    email: initialData?.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.content}>
      <h2 className={styles.sectionTitle}>Profile Settings</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="displayName">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="Your display name"
            className={styles.input}
            value={formData.displayName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, displayName: e.target.value }))
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            className={styles.input}
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};
