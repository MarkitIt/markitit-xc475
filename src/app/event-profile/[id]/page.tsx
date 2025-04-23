"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "../../../lib/firebase";
import "../../tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "@/context/UserContext";
import { Event } from "@/types/Event";
import Image from "next/image";

export default function EventProfilePage() {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Event" | "Reviews">("Event");
  const { user } = useUserContext();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Attempting to fetch event with ID:", idParam);

        // Check if the ID is numeric
        if (/^\d+$/.test(idParam)) {
          const numericId = parseInt(idParam);

          // Fetch all events
          const eventsRef = collection(db, "events");
          const querySnapshot = await getDocs(eventsRef);
          const allEvents = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Event[];

          console.log(`Found ${allEvents.length} events in total`);

          // Get the event at the specified index (adjust for zero-based array)
          const eventIndex = numericId - 1;
          if (eventIndex >= 0 && eventIndex < allEvents.length) {
            const selectedEvent = allEvents[eventIndex];
            console.log("Found event by index:", selectedEvent);
            setEvent(selectedEvent);
          } else {
            console.log(
              `Event index out of range: ${eventIndex}, total events: ${allEvents.length}`,
            );
            setError(`Event #${numericId} not found`);
          }
        } else {
          // Try to get by document ID
          const docRef = doc(db, "events", idParam);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const eventData = { ...docSnap.data(), id: docSnap.id } as Event;
            console.log("Found event by document ID:", eventData);
            setEvent(eventData);
          } else {
            console.log("No event found with ID:", idParam);
            setError("Event not found");
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Error loading event");
      } finally {
        setLoading(false);
      }
    };

    if (idParam) {
      fetchEvent();
    }
  }, [idParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-600">{error}</div>
        <div className="text-sm text-gray-500">
          Attempted to find event: {idParam}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-gray-600">Event not found</div>
        <div className="text-sm text-gray-500">
          Attempted to find event: {idParam}
        </div>
      </div>
    );
  }

  const handleReviewsClick = () => {
    setActiveTab("Reviews");
    router.push(`/event-profile/${idParam}/reviews`);
  };

  const formatDate = (
    date: { seconds: number; nanoseconds: number } | undefined,
  ) => {
    if (!date) return "";
    return new Date(date.seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="event-profile-container">
      {/* Header with Host Avatar */}
      <div className="header-container">
        <div className="host-avatar">H</div>
      </div>

      {/* Main Content */}
      <div className="event-content-container">
        {/* Event Header */}
        <div className="event-header">
          <div className="event-header-content">
            <div className="event-image-container">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.name}
                  className="event-image"
                />
              ) : (
                <div className="event-image-placeholder">
                  <span className="event-image-placeholder-text">
                    {event.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="event-header-info">
              <h1 className="event-name">{event.name}</h1>
              <p className="event-description">{event.description}</p>
              <div className="rating-container">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={
                      i < (event.rating || 0) ? "star-active" : "star-inactive"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          {user && (
            <Link
              href={`/event-profile/${idParam}/apply`}
              className="apply-button"
            >
              Apply
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "Event" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Event")}
            >
              Event
            </button>
            <button
              className={`tab ${activeTab === "Reviews" ? "active-tab" : ""}`}
              onClick={handleReviewsClick}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Event Details */}
        {activeTab === "Event" && (
          <div className="event-details-section">
            {/* Event Information */}
            <div className="event-info-section">
              <h2 className="section-title">Event Information</h2>
              <div className="event-info-grid">
                <div className="event-info-item">
                  <h3 className="info-label">Date & Time</h3>
                  <p className="info-value">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                </div>
                <div className="event-info-item">
                  <h3 className="info-label">Location</h3>
                  <p className="info-value">
                    {event.location?.city}, {event.location?.state}
                  </p>
                </div>
                <div className="event-info-item">
                  <h3 className="info-label">Vendor Fee</h3>
                  <p className="info-value">
                    ${event.vendorFee?.toFixed(2) || "Not specified"}
                  </p>
                </div>
                <div className="event-info-item">
                  <h3 className="info-label">Total Cost</h3>
                  <p className="info-value">
                    ${event.totalCost?.toFixed(2) || "Not specified"}
                  </p>
                </div>
                {event.headcount && (
                  <div className="event-info-item">
                    <h3 className="info-label">Expected Headcount</h3>
                    <p className="info-value">{event.headcount}</p>
                  </div>
                )}
                {event.attendeeType && (
                  <div className="event-info-item">
                    <h3 className="info-label">Attendee Type</h3>
                    <p className="info-value">
                      {event.attendeeType.join(", ")}
                    </p>
                  </div>
                )}
                {event.type && (
                  <div className="event-info-item">
                    <h3 className="info-label">Event Type</h3>
                    <p className="info-value">{event.type.join(", ")}</p>
                  </div>
                )}
                {event.categories && (
                  <div className="event-info-item">
                    <h3 className="info-label">Categories</h3>
                    <p className="info-value">{event.categories.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Demographics */}
            {event.demographics && event.demographics.length > 0 && (
              <div className="demographics-section">
                <h2 className="section-title">Demographics</h2>
                <div className="demographics-tags">
                  {event.demographics.map((demo, index) => (
                    <span key={index} className="demographic-tag">
                      {demo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
