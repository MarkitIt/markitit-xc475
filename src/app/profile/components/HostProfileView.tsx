import { FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';
import styles from '../styles.module.css';

interface HostProfileProps {
  hostProfile: {
    contactEmail: string;
    phoneNumber: string;
    eventTypes: string[];
    description: string;
    website: string;
  };
  showPrivateSections: boolean;
}

export default function HostProfileView({ hostProfile }: HostProfileProps) {
  return (
    <div className={styles.profileContainer}>
      {/* Description Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>About Us</h2>
        <p className={styles.description}>{hostProfile.description}</p>
      </div>

      {/* Event Types Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Event Types</h2>
        <div className={styles.eventTypesGrid}>
          {hostProfile.eventTypes.map((type, index) => (
            <div key={index} className={styles.eventTypeTag}>
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <FaPhone className={styles.icon} />
            <a href={`tel:${hostProfile.phoneNumber}`} className={styles.contactLink}>
              {hostProfile.phoneNumber}
            </a>
          </div>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.icon} />
            <a href={`mailto:${hostProfile.contactEmail}`} className={styles.contactLink}>
              {hostProfile.contactEmail}
            </a>
          </div>
          {hostProfile.website && (
            <div className={styles.contactItem}>
              <FaGlobe className={styles.icon} />
              <a href={hostProfile.website} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 