import { useState } from 'react';
import styles from '../../styles.module.css';

interface ProfileSettingsHostProps {
  initialData?: {
    phoneNumber: string;
    organizationDescription: string;
    eventCapacity: string;
    eventTypes: string[];
    website: string;
    organizationName: string;
    contactEmail: string;
  };
  onSave: (data: {
    phoneNumber: string;
    organizationDescription: string;
    eventCapacity: string;
    eventTypes: string[];
    website: string;
    organizationName: string;
    contactEmail: string;
  }) => void;
}

export const ProfileSettingsHost = ({ initialData, onSave }: ProfileSettingsHostProps) => {
  const [formData, setFormData] = useState({
    phoneNumber: initialData?.phoneNumber || '',
    organizationDescription: initialData?.organizationDescription || '',
    eventCapacity: initialData?.eventCapacity || '',
    eventTypes: initialData?.eventTypes || [],
    website: initialData?.website || '',
    organizationName: initialData?.organizationName || '',
    contactEmail: initialData?.contactEmail || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleEventTypesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedEventTypes = [...formData.eventTypes];
    updatedEventTypes[index] = e.target.value;
    setFormData((prev) => ({ ...prev, eventTypes: updatedEventTypes }));
  };

  return (
    <div className={styles.content}>
      <h2 className={styles.sectionTitle}>Profile Settings</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="organizationName">
            Organization Name
          </label>
          <input
            id="organizationName"
            type="text"
            placeholder="Your organization name"
            className={styles.input}
            value={formData.organizationName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, organizationName: e.target.value }))
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="contactEmail">
            Contact Email
          </label>
          <input
            id="contactEmail"
            type="email"
            placeholder="Your contact email"
            className={styles.input}
            value={formData.contactEmail}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            placeholder="Your phone number"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="organizationDescription">
            Organization Description
          </label>
          <textarea
            id="organizationDescription"
            placeholder="Describe your organization"
            className={styles.textarea}
            value={formData.organizationDescription}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, organizationDescription: e.target.value }))
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="eventCapacity">
            Event Capacity
          </label>
          <input
            id="eventCapacity"
            type="text"
            placeholder="Event capacity (e.g., small, medium, large)"
            className={styles.input}
            value={formData.eventCapacity}
            onChange={(e) => setFormData((prev) => ({ ...prev, eventCapacity: e.target.value }))}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Event Types</label>
          {formData.eventTypes.map((type, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Event type ${index + 1}`}
              className={styles.input}
              value={type}
              onChange={(e) => handleEventTypesChange(e, index)}
            />
          ))}
          <button
            type="button"
            className={styles.addButton}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                eventTypes: [...prev.eventTypes, ''],
              }))
            }
          >
            Add Event Type
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="text"
            placeholder="Your website URL"
            className={styles.input}
            value={formData.website}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};