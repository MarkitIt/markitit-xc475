import Image from 'next/image';
import styles from '../styles.module.css';

interface SidebarProps {
  user: any;
  vendorProfile: any;
}

export default function Sidebar({ user, vendorProfile }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profileCard}>
        <div className={styles.profilePic}>
          {vendorProfile?.logo ? (
            <Image 
              src={vendorProfile.logo} 
              alt={`${vendorProfile.businessName} logo`} 
              width={80} 
              height={80} 
              style={{ 
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          ) : (
            <div className={styles.profilePicPlaceholder}>
              {vendorProfile?.businessName?.charAt(0) || 'B'}
            </div>
          )}
        </div>
        <h3 className={styles.profileName}>{vendorProfile?.businessName || "Business Name"}</h3>
        <p className={styles.businessName}>{vendorProfile?.contactName || "Contact Name"}</p>
      </div>
      <nav className={styles.sidebarNav}>
        <a href="#" className={styles.navLink}>Upcoming Events</a>
        <a href="#" className={styles.navLink}>My Applications</a>
        <a href="#" className={styles.navLink}>Financial Overview</a>
        <a href="#" className={styles.navLink}>Feed</a>
      </nav>
    </aside>
  );
} 