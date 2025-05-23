import React from "react";
import Link from "next/link";
import Image from "next/image";
import "../app/tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Event } from "@/types/Event";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
  console.log("EventCard startDate:", event.startDate, "endDate:", event.endDate);
  const displayScore = score !== undefined ? score : event.score;
  const formattedScore =
    displayScore !== undefined && displayScore > 100
      ? displayScore / 100
      : displayScore;

      const formatDate = (date: { seconds: number; nanoseconds: number } | undefined) => {
        if (!date) return "";
        const eventDate = new Date(date.seconds * 1000);
        return eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };

  let dateDisplay = "Date not available";
  if (event.startDate && event.endDate) {
    const startFormatted = formatDate(event.startDate);
    const endFormatted = formatDate(event.endDate);
    dateDisplay =
      startFormatted && endFormatted
        ? startFormatted === endFormatted
          ? startFormatted
          : `${startFormatted} - ${endFormatted}`
        : "Date not available";
  } else if (event.startDate) {
    const startFormatted = formatDate(event.startDate);
    dateDisplay = startFormatted || "Date not available";
  } else if (event.endDate) {
    const endFormatted = formatDate(event.endDate);
    dateDisplay = endFormatted || "Date not available";
  }

  return (
    <Link href={`/event-profile/${encodeURIComponent(event.id)}`} className="card">
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

        {formattedScore !== undefined && (
          <div className="score-donut" style={{ width: "60px", height: "60px", margin: "0.5rem auto" }}>
            <CircularProgressbar
              value={formattedScore}
              text={`${Math.round(formattedScore)}%`}
              maxValue={100}
              styles={buildStyles({
                textColor: "#000",
                pathColor: "#7C3AED",
                trailColor: "#f3f4f6",
                textSize: "16px",
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
        )}

        <h3 className="event-title">{event.name}</h3>

        <div className="rating-container">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              className={i < (event.rating || 0) ? "star-active" : "star-inactive"}
              size="sm"
            />
          ))}
        </div>

        <div className="event-details">
          <div className="event-date">
            <FontAwesomeIcon icon={faCalendarAlt} className="icon-calendar" />
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </div>
          <div className="event-location">
            {event.location?.city}, {event.location?.state}
          </div>
        </div>
      </div>
    </Link>
  );
};
