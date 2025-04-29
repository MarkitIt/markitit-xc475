import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import styles from '../styles.module.css';
import { DocumentReference } from "firebase/firestore";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface EventHeaderProps {
  event: any;
  applicationStatus: null | "PENDING" | "ACCEPTED" | "REJECTED";
  isSubmitting: boolean;
  handleVerifiedApply: () => Promise<void>;
  disabled: boolean;
  buttonText: string;
}

export default function EventHeader({
  event,
  applicationStatus,
  isSubmitting,
  handleVerifiedApply,
  disabled,
  buttonText
}: EventHeaderProps) {
  const router = useRouter();

  return (
    <div className={styles.topSection}>
      <div className={styles.imageContainer}>
        {event.image ? (
          <Image 
            src={event.image} 
            alt={event.name} 
            width={400} 
            height={260} 
            className={styles.eventImage}
          />
        ) : (
          <span className={styles.noImage}>No Image</span>
        )}
        
        <div className={styles.buttonContainer}>
          {event?.hostProfile ? (
            <button
              onClick={handleVerifiedApply}
              disabled={disabled}
              className={styles.applyButton}
              title={
                applicationStatus === "PENDING" ? "You have already applied to this event."
                : applicationStatus === "ACCEPTED" ? "Your application was accepted!"
                : applicationStatus === "REJECTED" ? "Your application was rejected."
                : isSubmitting ? "Submitting..." : "This is a verified host, click for one-click apply."
              }
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              {buttonText}
              {applicationStatus === null && !isSubmitting && (
                <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
              )}
            </button>
          ) : (
            <button
              onClick={() => event?.applicationLink && window.open(event.applicationLink, '_blank')}
              className={styles.applyButton}
              disabled={!event?.applicationLink}
              title={event?.applicationLink ? "Apply through external link" : "Organizer did not provide application link"}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Apply Now
            </button>
          )}
          
          <button
            onClick={() => router.push("/community")}
            className={styles.contactButton}
          >
            Contact Organizer
          </button>
        </div>
      </div>

      <div className={styles.contentSection}>
        <h1 className={styles.eventTitle}>{event.name}</h1>
        <p className={styles.eventDescription}>{event.description}</p>
        {typeof event.score === "number" && !isNaN(event.score) && (
          <div className={styles.scoreContainer}>
            <CircularProgressbar
              value={event.score}
              text={`${Math.round(event.score)}%`}
              maxValue={100}
              styles={buildStyles({
                textColor: "var(--text-primary)",
                pathColor: "var(--primary-coral)",
                trailColor: "#e5e7eb",
                textSize: "18px",
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
} 