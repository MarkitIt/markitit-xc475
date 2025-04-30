import Image from 'next/image';
import { FaInstagram, FaFacebook, FaEtsy, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import styles from '../styles.module.css';

interface VendorProfileProps {
  vendorProfile: {
    businessName: string;
    description: string;
    logo: string;
    images: string[];
    instagram?: string;
    facebook?: string;
    etsy?: string;
    phoneNumber: string;
    email: string;
    website?: string;
    city: string;
    state: string;
    applications: Array<{
      status: string;
    }>;
    demographic: string[];
    eventPreference: string[];
    eventPriorityFactors: string[];
    categories: string[];
    cities: string[];
    additionalInfo?: string;
    createOwnProducts: boolean;
    preferredEventSize: {
      min: number;
      max: number;
    };
    schedule: {
      preferredDays: string[];
    };
  };
  showPrivateSections: boolean;
  isProfileOwner: boolean;
}

export default function VendorProfileView({ vendorProfile, showPrivateSections, isProfileOwner }: VendorProfileProps) {
  const acceptedApplications = vendorProfile.applications?.filter(
    app => app.status === "ACCEPTED"
  ).length || 0;

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.profileHeader}>
        <div className={styles.logoContainer}>
          {vendorProfile.logo && (
            <Image
              src={vendorProfile.logo}
              alt={`${vendorProfile.businessName} logo`}
              width={150}
              height={150}
              className={styles.logo}
            />
          )}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.businessNameContainer}>
            <h1 className={styles.businessName}>{vendorProfile.businessName}</h1>
            {isProfileOwner && (
              <Link href="/profile/edit" className={styles.editButton}>
                Edit Profile
              </Link>
            )}
          </div>
          <p className={styles.location}>
            <FaMapMarkerAlt className={styles.icon} />
            {vendorProfile.city}, {vendorProfile.state}
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>About Us</h2>
        <p className={styles.description}>{vendorProfile.description}</p>
        {vendorProfile.additionalInfo && showPrivateSections && (
          <div className={styles.privateSection}>
            <div className={styles.privateLabel}>Private Information (Visible to hosts only)</div>
            <p className={styles.additionalInfo}>{vendorProfile.additionalInfo}</p>
          </div>
        )}
      </div>

      {/* Categories and Demographics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Categories & Demographics</h2>
        <div className={styles.tagsSection}>
          <div className={styles.tagGroup}>
            <h3 className={styles.tagTitle}>Product Categories</h3>
            <div className={styles.tags}>
              {vendorProfile.categories.map((category, index) => (
                <span key={index} className={`${styles.tag} ${styles.categoryTag}`}>
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Preferences - Private Section */}
      {showPrivateSections && (
        <div className={styles.section}>
          <div className={styles.privateLabel}>Private Information (Visible to hosts only)</div>
          <h2 className={styles.sectionTitle}>Event Preferences</h2>
          <div className={styles.preferencesGrid}>
            <div className={styles.preferenceItem}>
              <FaCalendarAlt className={styles.icon} />
              <h3 className={styles.preferenceTitle}>Preferred Days</h3>
              <div className={styles.tags}>
                {vendorProfile.schedule.preferredDays.map((day, index) => (
                  <span key={index} className={`${styles.tag} ${styles.dayTag}`}>
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.preferenceItem}>
              <FaUsers className={styles.icon} />
              <h3 className={styles.preferenceTitle}>Preferred Event Size</h3>
              <p className={styles.eventSize}>
                {vendorProfile.preferredEventSize.min} - {vendorProfile.preferredEventSize.max} vendors
              </p>
            </div>
          </div>
          <div className={styles.tagGroup}>
            <h3 className={styles.tagTitle}>Event Types</h3>
            <div className={styles.tags}>
              {vendorProfile.eventPreference.map((type, index) => (
                <span key={index} className={`${styles.tag} ${styles.eventTag}`}>
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Images Section */}
      {vendorProfile.images && vendorProfile.images.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Products</h2>
          <div className={styles.imageGrid}>
            {vendorProfile.images.map((image, index) => (
              <div key={index} className={styles.imageContainer}>
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  width={300}
                  height={300}
                  className={styles.productImage}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <FaPhone className={styles.icon} />
            <a href={`tel:${vendorProfile.phoneNumber}`} className={styles.contactLink}>
              {vendorProfile.phoneNumber}
            </a>
          </div>
          <div className={styles.contactItem}>
            <FaEnvelope className={styles.icon} />
            <a href={`mailto:${vendorProfile.email}`} className={styles.contactLink}>
              {vendorProfile.email}
            </a>
          </div>
          {vendorProfile.website && (
            <div className={styles.contactItem}>
              <FaGlobe className={styles.icon} />
              <a href={vendorProfile.website} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                {vendorProfile.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Social Media Links */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Connect With Us</h2>
        <div className={styles.socialGrid}>
          {vendorProfile.instagram && (
            <a href={vendorProfile.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaInstagram className={styles.socialIcon} />
              <span>Instagram</span>
            </a>
          )}
          {vendorProfile.facebook && (
            <a href={vendorProfile.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaFacebook className={styles.socialIcon} />
              <span>Facebook</span>
            </a>
          )}
          {vendorProfile.etsy && (
            <a href={vendorProfile.etsy} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaEtsy className={styles.socialIcon} />
              <span>Etsy</span>
            </a>
          )}
        </div>
      </div>

      {/* MarkitIt Stats */}
      <div className={styles.section}>
        <div className={styles.statsContainer}>
          <p className={styles.stats}>
            {vendorProfile.businessName} has attended <span className={styles.statsHighlight}>{acceptedApplications}</span> pop ups with MarkitIt
          </p>
        </div>
      </div>
    </div>
  );
} 