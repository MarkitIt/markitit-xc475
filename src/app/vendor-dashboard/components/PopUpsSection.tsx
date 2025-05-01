import styles from '../styles.module.css';

interface Event {
  id: string;
  name: string;
  startDate: any;
  endDate: any;
  location: {
    city: string;
    state: string;
  };
}

interface PopUpsSectionProps {
  currentMonthName: string;
  loadingEvents: boolean;
  acceptedEvents: Event[];
  formatDate: (date: any) => string;
  formatTime: (date: any) => string;
}

export default function PopUpsSection({
  currentMonthName,
  loadingEvents,
  acceptedEvents,
  formatDate,
  formatTime
}: PopUpsSectionProps) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Your Pop-Ups in {currentMonthName}</h2>
      {loadingEvents ? (
        <p>Loading events...</p>
      ) : acceptedEvents.length > 0 ? (
        <div className={styles.eventsGrid}>
          {acceptedEvents.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <h4>{event.name}</h4>
              <p><strong>DATE:</strong> {formatDate(event.startDate)}</p>
              <p><strong>TIME:</strong> {formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
              <p><strong>PLACE:</strong> {event.location?.city}, {event.location?.state}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noDataMessage}>No accepted pop-ups this month.</p>
      )}
    </div>
  );
} 