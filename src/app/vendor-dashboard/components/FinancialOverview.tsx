import styles from '../styles.module.css';

interface FinancialOverviewProps {
  vendorProfile: any;
}

export default function FinancialOverview({ vendorProfile }: FinancialOverviewProps) {
  return (
    <div className={styles.financialCard}>
      <h3 className={styles.rightPanelTitle}>Financial overview</h3>
      <p>This Month</p>
      <p>You have attended <strong>{vendorProfile?.applications?.length || 0}</strong> Pop Ups</p>
      <div className={styles.financeDetails}>
        <div className={styles.financeItem}>
          <h4>Costs</h4>
          <p className={styles.placeholderText}>$XXX.XX</p>
        </div>
        <div className={styles.financeItem}>
          <h4>Revenue</h4>
          <p className={styles.placeholderText}>$XXX.XX</p>
        </div>
      </div>
    </div>
  );
} 