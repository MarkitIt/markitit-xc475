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

  const handleEventTypesChange = (selectedOptions: string[]) => {
    setFormData((prev) => ({ ...prev, eventTypes: selectedOptions }));
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

        {/* Event Capacity Dropdown */}
        <div className={styles.formGroup}>
          <label
            style={{
              display: 'block',
              fontSize: '1rem',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Typical Event Capacity*
          </label>
          <select
            required
            value={formData.eventCapacity}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, eventCapacity: e.target.value }))
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          >
            <option value="">Select capacity range</option>
            <option value="small">Small (1-20 vendors)</option>
            <option value="medium">Medium (21-50 vendors)</option>
            <option value="large">Large (51-100 vendors)</option>
            <option value="xlarge">Extra Large (100+ vendors)</option>
          </select>
        </div>

        {/* Event Types Dropdown */}
        <div className={styles.formGroup}>
          <label
            style={{
              display: 'block',
              fontSize: '1rem',
              color: '#333',
              marginBottom: '0.5rem',
            }}
          >
            Event Types*
          </label>
          <select
            required
            multiple
            value={formData.eventTypes}
            onChange={(e) =>
              handleEventTypesChange(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          >
            <option value="market">Markets</option>
            <option value="fair">Fairs</option>
            <option value="festival">Festivals</option>
            <option value="popup">Pop-up Events</option>
            <option value="other">Other</option>
          </select>
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