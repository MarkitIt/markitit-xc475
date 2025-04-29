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
          {user?.photoURL ? (
            <Image src={user.photoURL} alt="Profile" width={80} height={80} style={{ borderRadius: '50%' }}/>
          ) : (
            <div className={styles.profilePicPlaceholder}></div>
          )}
        </div>
        <h3 className={styles.profileName}>{vendorProfile?.contactName || "Vendor Name"}</h3>
        <p className={styles.businessName}>{vendorProfile?.businessName || "Business Name"}</p>
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