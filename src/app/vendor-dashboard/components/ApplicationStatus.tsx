import styles from '../styles.module.css';

interface Application {
  id: string;
  eventName?: string;
  status: string;
}

interface ApplicationStatusProps {
  loadingApplications: boolean;
  recentApplications: Application[];
  getStatusPillStyle: (status: string) => string;
}

export default function ApplicationStatus({
  loadingApplications,
  recentApplications,
  getStatusPillStyle
}: ApplicationStatusProps) {
  return (
    <div className={styles.applicationStatusCard}>
      <h3 className={styles.rightPanelTitle}>Application Status</h3>
      {loadingApplications ? (
        <p>Loading applications...</p>
      ) : recentApplications.length > 0 ? (
        <ul className={styles.appList}>
          {recentApplications.map((app) => (
            <li key={app.id} className={styles.appListItem}>
              <span>{app.eventName || 'Unnamed Event'}</span>
              <span className={`${styles.statusPill} ${getStatusPillStyle(app.status)}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent applications found.</p>
      )}
    </div>
  );
} 