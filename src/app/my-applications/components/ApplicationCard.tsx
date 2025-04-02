import styles from '../styles.module.css';

interface ApplicationCardProps {
  eventName: string;
  status: string;
  submissionDate: string;
  onViewDetails: () => void;
}

export const ApplicationCard = ({
  eventName,
  status,
  submissionDate,
  onViewDetails,
}: ApplicationCardProps) => (
  <div className={styles.applicationCard}>
    <div className={styles.cardHeader}>
      <h2 className={styles.eventName}>{eventName}</h2>
      <span className={styles.status}>{status}</span>
    </div>
    
    <p className={styles.submissionDate}>
      Application submitted on {submissionDate}
    </p>
    
    <button 
      onClick={onViewDetails}
      className={styles.viewButton}
    >
      View Details
    </button>
  </div>
); 