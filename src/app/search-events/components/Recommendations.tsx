import styles from "../styles.module.css";

interface Event {
  id: string;
  name: string;
}

interface RecommendationsProps {
  events: Event[];
}

export const Recommendations = ({ events }: RecommendationsProps) => {
  if (!events || events.length === 0) return null;

  return (
    <div className={styles.recommendations}>
      <h2 className={styles.recommendationsTitle}>Recommended Events</h2>
      {/* <ul className={styles.recommendationsList}>
        {events.map(event => (
          <li key={event.id} className={styles.recommendationItem}>
            {event.name}
          </li>
        ))}
      </ul> */}
    </div>
  );
};
