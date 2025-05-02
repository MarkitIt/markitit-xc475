import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { fetchEventRankings } from '@/utils/fetchEventRankings';
import Link from 'next/link';
import styles from '../styles.module.css';

interface RankedEvent {
  id: string;
  name: string;
  location: { city: string; state: string };
  startDate: { seconds: number; nanoseconds: number };
  score: number;
}

interface Event {
  id: string;
  name: string;
  location: {
    city: string;
    state: string;
  };
  startDate: {
    seconds: number;
    nanoseconds: number;
  };
  score: number;
}

export default function TopOpportunities() {
  const { user } = useUserContext();
  const [topEvents, setTopEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopEvents = async () => {
      if (!user) return;
      
      try {
        const response = await fetchEventRankings(user.uid);
        if (response.data?.rankedEvents) {
          // Get top 3 events
          const topThree = response.data.rankedEvents
            .slice(0, 3)
            .map((event: RankedEvent) => ({
              id: event.id,
              name: event.name,
              location: event.location,
              startDate: event.startDate,
              score: event.score
            }));
          setTopEvents(topThree);
        }
      } catch (error) {
        console.error('Error fetching top events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEvents();
  }, [user]);

  if (loading) return <div className={styles.loading}>Loading opportunities...</div>;
  if (!topEvents.length) return <div className={styles.noEvents}>No opportunities found</div>;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Top Opportunities for You</h2>
      <div className={styles.opportunitiesGrid}>
        {topEvents.map((event) => (
          <Link href={`/event-profile/${event.id}`} key={event.id} className={styles.opportunityCard}>
            <div className={styles.opportunityContent}>
              <h3 className={styles.eventName}>{event.name}</h3>
              <p className={styles.eventLocation}>
                {event.location.city}, {event.location.state}
              </p>
              <p className={styles.eventDate}>
                {new Date(event.startDate.seconds * 1000).toLocaleDateString()}
              </p>
              <div className={styles.scoreContainer}>
                <span className={styles.scoreLabel}>Match Score:</span>
                <span className={styles.scoreValue}>{Math.round(event.score)}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <Link href="/search-events" className={styles.readMoreButton}>
          View More
        </Link>
      </div>
    </section>
  );
} 