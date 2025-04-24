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
  const idParam = decodeURIComponent(params.id as string);
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

        // More detailed debugging
        console.log("Original URL parameter:", params.id);
        console.log("Decoded parameter:", idParam);
        console.log("Attempting to fetch event with ID:", idParam);

        // Fetch all events to check available IDs
        const eventsRef = collection(db, "events");
        const querySnapshot = await getDocs(eventsRef);
        const allEvents = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Event[];

        console.log(`Found ${allEvents.length} events in total`);
        // Log all document IDs for comparison
        const allIds = allEvents.map(e => e.id);
        console.log("All document IDs:", allIds);
        
        // Check if our exact ID exists in the list
        console.log("ID exists in database?", allIds.includes(idParam));
        
        // Try to determine if there's a close match
        const closeMatches = allIds.filter(id => id.includes(idParam) || idParam.includes(id));
        console.log("Close matches:", closeMatches);

        // Try to get by document ID
        const docRef = doc(db, "events", idParam);
        console.log("Querying Firestore with document ID:", idParam);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = { ...docSnap.data(), id: docSnap.id } as Event;
          console.log("Found event by document ID:", eventData);
          setEvent(eventData);
        } else {
          console.log("No event found with ID:", idParam);
          
          // Try to find an exact match in our fetched events
          const exactMatch = allEvents.find(e => e.id === idParam);
          if (exactMatch) {
            console.log("Found exact match in fetched events:", exactMatch);
            setEvent(exactMatch);
            return;
          }
          
          // Try to find by name or partial ID match
          console.log("Trying to find by name or partial ID match...");
          const partialMatch = allEvents.find(e => 
            (e.id && e.id.includes(idParam)) || 
            (idParam.includes(e.id)) ||
            (e.name && e.name.includes(idParam)) ||
            (idParam.includes(e.name || ""))
          );
          
          if (partialMatch) {
            console.log("Found partial match:", partialMatch);
            setEvent(partialMatch);
          } else {
            console.log("No matches found at all");
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
    router.push(`/event-profile/${params.id}/reviews`);
  };

  const formatDate = (
    date: { seconds: number; nanoseconds: number } | undefined,
  ) => {
    if (!date) return "";
    
    const eventDate = new Date(date.seconds * 1000);
    // If year is 1970 (epoch default) or no year in the data, use current year
    if (eventDate.getFullYear() === 1970 || !date.seconds) {
      const currentYear = new Date().getFullYear();
      eventDate.setFullYear(currentYear);
    }
    
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
              href={`/event-profile/${params.id}/apply`}
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
