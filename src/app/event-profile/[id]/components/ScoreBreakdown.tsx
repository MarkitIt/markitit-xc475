import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import styles from '../styles.module.css';
import { Pill } from './Pill';

interface ScoreBreakdownProps {
  userScoreBreakdown: Record<string, number>;
  maxPoints: Record<string, number>;
  userPriorityKeys: string[];
}

export default function ScoreBreakdown({ 
  userScoreBreakdown,
  maxPoints,
  userPriorityKeys
}: ScoreBreakdownProps) {
  if (!userScoreBreakdown) return null;

  return (
    <div className={styles.scoreBreakdown}>
      <div className={styles.scoreHeader}>
        <h2 className={styles.scoreTitle}>
          Why this score?
        </h2>
        <span className={styles.infoIcon}>
          <FontAwesomeIcon icon={faInfoCircle} title="Scores marked with a star are your priority factors. These are weighted more heavily based on your vendor profile preferences." />
        </span>
      </div>
      <div className={styles.scoreGrid}>
        {Object.entries(userScoreBreakdown)
          .filter(([key]) => key !== "total" && key !== "pastEventScore" && key !== "vendorsNeededScore" && key !== "descriptionScore")
          .sort((a, b) => Number(b[1]) - Number(a[1]))
          .map(([key, value]) => {
            const max = maxPoints[key] || 1;
            const percent = Math.round((Number(value) / max) * 100);
            const isPriority = userPriorityKeys.includes(key);
            return (
              <div
                key={key}
                className={`${styles.scoreCard} ${isPriority ? styles.priority : ''}`}
              >
                <div className={styles.scoreHeader}>
                  <Pill color="#fef3c7">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Pill>
                  {isPriority && (
                    <span className={styles.priorityLabel}>
                      <FontAwesomeIcon icon={faStar} className={styles.priorityStar} title="Your Priority" />
                      <span className={styles.priorityText}>Priority</span>
                    </span>
                  )}
                </div>
                <div className={styles.scoreValue}>{Math.round(Number(value))} / {max}</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${percent}%` }} />
                </div>
                <div className={styles.scoreDescription}>
                  {(() => {
                    switch (key) {
                      case "eventTypeScore": return "How well the event type matches your preferences.";
                      case "locationScore": return "How well the location matches your preferred cities.";
                      case "budgetScore": return "How well the booth fees fit your budget.";
                      case "demographicsScore": return "How well the event's audience matches your target demographic.";
                      case "eventSizeScore": return "How well the event size matches your preferred size.";
                      case "scheduleScore": return "How well the event dates match your preferred days.";
                      case "vendorCategoryScore": return "How well your vendor category matches the event.";
                      default: return "";
                    }
                  })()}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
} 