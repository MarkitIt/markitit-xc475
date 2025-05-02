import styles from '../styles.module.css';

interface Update {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'feature' | 'improvement' | 'announcement';
}

const mockUpdates: Update[] = [
  {
    id: '1',
    title: 'Enhanced Event Matching Algorithm',
    description: 'Our new matching system now considers more factors to find the perfect events for your business.',
    date: '2024-05-15',
    type: 'feature'
  },
  {
    id: '2',
    title: 'Mobile App Coming Soon',
    description: 'Stay tuned for our mobile app launch, making it easier to manage your events on the go.',
    date: '2024-06-01',
    type: 'announcement'
  },
  {
    id: '3',
    title: 'Improved Application Process',
    description: 'Streamlined application process with auto-fill capabilities and better status tracking.',
    date: '2024-04-20',
    type: 'improvement'
  }
];

export default function MarkitItUpdates() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>MarkitIt Updates</h2>
      <div className={styles.updatesGrid}>
        {mockUpdates.map((update) => (
          <div key={update.id} className={styles.updateCard}>
            <div className={styles.updateContent}>
              <div className={styles.updateHeader}>
                <span className={`${styles.updateType} ${styles[update.type]}`}>
                  {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                </span>
                <span className={styles.updateDate}>
                  {new Date(update.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className={styles.updateTitle}>{update.title}</h3>
              <p className={styles.updateDescription}>{update.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 