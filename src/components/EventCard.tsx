import React from "react";
import Link from "next/link";
import Image from "next/image";
import "../app/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Event } from "@/types/Event";
import { theme } from "@/styles/theme";

interface EventCardProps {
  event: Event;
  index: number;
  rank?: number;
  showRank?: boolean;
  score?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  index,
  rank,
  showRank,
  score,
}) => {
  // Use the score from props if provided, otherwise use the score from the event
  const displayScore = score !== undefined ? score : event.score;

  // Debug output for scores
  console.log(
    `EventCard for ${event.name}: Raw API score=${displayScore}, Score breakdown:`,
    event.scoreBreakdown,
  );

  // Calculate the properly formatted score - if over 100, divide by 100
  const formattedScore =
    displayScore !== undefined && displayScore > 100
      ? displayScore / 100
      : displayScore;

  // Format date as startDate - endDate
  const formatDate = (timestamp: any) => {
    if (!timestamp) return null;
    return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format the date display
  let dateDisplay = "Date not available";
  if (event.startDate && event.endDate) {
    const startFormatted = formatDate(event.startDate);
    const endFormatted = formatDate(event.endDate);

    if (startFormatted === endFormatted) {
      // Single day event
      dateDisplay = startFormatted as string;
    } else {
      // Multi-day event
      dateDisplay = `${startFormatted} - ${endFormatted}`;
    }
  } else if (event.startDate) {
    // Only start date available
    dateDisplay = formatDate(event.startDate) as string;
  }

  return (
    <Link href={`/event-profile/${index + 1}`} className="card">
      <div className="event-card">
        <div className="image-container">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.name}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="image-placeholder">
              <span className="text-secondary">No Image</span>
            </div>
          )}
        </div>
        <h3 className="event-title">{event.name}</h3>
        <div className="rating-container">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={
                i < (event.rating || 0) ? "star-active" : "star-inactive"
              }
              size="sm"
            />
          ))}
        </div>
        <div className="event-details">
          <div className="event-date">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon-calendar" />
            {dateDisplay}
          </div>
          <div className="event-location">
            {event.location?.city}, {event.location?.state}
          </div>
        </div>
      </div>
    </Link>
  );
};
