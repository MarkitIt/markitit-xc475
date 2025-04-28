"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "./components/Pagination";
import { useUserContext } from "@/context/UserContext";
import { fetchEventRankings } from "@/utils/fetchEventRankings";
import styles from "./styles.module.css";
import { Event } from "@/types/Event";
import { parseEventDate } from "@/utils/inferEventData";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";
import { cities as allowedCities } from "@/types/cities";

export default function SearchEvents() {
  const { theme } = useTheme();
  const { user, vendorProfile } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [selectedType, setSelectedType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const eventsPerPage = 9;

  // Calculate current events to display based on pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent,
  );

  const formatDate = (date: { seconds: number; nanoseconds: number } | undefined) => {
    if (!date) return "";
    const eventDate = new Date(date.seconds * 1000);
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetching events from API if user has vendor profile, otherwise from Firestore
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);

      try {
        let eventsList: Event[] = [];

        if (user && vendorProfile) {
          // Fetch ranked events from API
          const rankingResponse = await fetchEventRankings(user.uid);

          if (rankingResponse.error) {
            throw new Error(rankingResponse.error);
          }

          // Map the ranked events to include score
          eventsList = rankingResponse.data.rankedEvents.map((event: any) => ({
            ...event,
            score: event.scoreBreakdown.total * 100, // Convert to percentage
            startDate: event.startDate ? {
              seconds: event.startDate.seconds,
              nanoseconds: event.startDate.nanoseconds
            } : null,
            endDate: event.endDate ? {
              seconds: event.endDate.seconds,
              nanoseconds: event.endDate.nanoseconds
            } : null
          })) as Event[];

          // Sort by score (highest first)
          eventsList.sort((a: any, b: any) => b.score - a.score);
        } else {
          // Fetch from Firestore for non-vendor users
          const querySnapshot = await getDocs(collection(db, "eventsFormatted"));
          eventsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Event[];
        }

        console.log("Events from API/Firestore:", eventsList);
        setEvents(eventsList);
        setFilteredEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events:", err);
        // If there's an error with the API, fall back to regular events
        try {
          const querySnapshot = await getDocs(collection(db, "eventsFormatted"));
          const eventsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Event[];
          setEvents(eventsList);
          setFilteredEvents(eventsList);
        } catch (fallbackErr) {
          setError("Error loading events");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user, vendorProfile]);

  // Handle search
  const handleSearch = (
    city: string,
    startDate: string,
    endDate: string,
    keywords: string,
  ) => {
    setCurrentPage(1);

    const now = new Date();
    const filtered = events.filter((event) => {
      // Only show events in allowed cities
      if (!event.location || !allowedCities.includes(event.location.city)) return false;
      // Only show events today or in the future
      const getDate = (ts: any) =>
        ts && typeof ts.seconds === "number"
          ? new Date(ts.seconds * 1000)
          : ts
          ? new Date(ts)
          : null;

      const startDateObj = getDate(event.startDate);
      const endDateObj = getDate(event.endDate);
      const eventDate = endDateObj || startDateObj;
      if (!eventDate || eventDate < now) return false;

      // Check city
      const cityMatch = city
        ? event.location?.city?.toLowerCase().includes(city.toLowerCase())
        : true;

      // Check start date
      const startDateMatch = startDate
        ? startDateObj && startDateObj >= new Date(startDate)
        : true;

      // Check end date
      const endDateMatch = endDate
        ? endDateObj && endDateObj <= new Date(endDate)
        : true;

      // Check keywords in name or description
      const keywordsMatch = keywords
        ? event.name?.toLowerCase().includes(keywords.toLowerCase()) ||
          event.description?.toLowerCase().includes(keywords.toLowerCase())
        : true;

      return cityMatch && startDateMatch && endDateMatch && keywordsMatch;
    });
    setFilteredEvents(filtered);
  };

  const handleFilter = () => {
    const filtered = events.filter((event) => {
      const typeMatch = selectedType
        ? event.type?.includes(selectedType)
        : true;
      const cityMatch = selectedCity
        ? event.location?.city === selectedCity
        : true;
      const categoryMatch = selectedCategory
        ? event.categories?.includes(selectedCategory)
        : true;

      return typeMatch && cityMatch && categoryMatch;
    });

    setFilteredEvents(filtered);
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Add the handleEventClick function
  const handleEventClick = (eventId: string) => {
    router.push(`/event-profile/${eventId}`);
  };

  return (
    <div className="search-page">
      <h1 className="page-title">Find Events</h1>

      <SearchBar onSearch={handleSearch} />

      {/* Filter Bar */}
      <div className="filter-row">
        {/* Event Type Dropdown */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Festival">Festival</option>
        </select>

        {/* City Dropdown */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="filter-select"
        >
          <option value="">All Cities</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Art">Art</option>
          <option value="Music">Music</option>
        </select>

        {/* Apply Filters Button */}
        <button onClick={handleFilter} className="search-button">
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="loading-message">Loading events...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="events-grid">
            {currentEvents.map((event, idx) => (
              <EventCard
                key={event.id}
                event={event}
                index={idx}
                score={event.score}
                showRank={!!user && !!vendorProfile}
              />
            ))}
          </div>

          {filteredEvents.length > eventsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredEvents.length / eventsPerPage)}
              onPageChange={setCurrentPage}
            />
          )}
{/* 
          {filteredEvents.length === 0 && (
            <div className="no-results-message">
              No events found matching your criteria.
            </div>
          )} */}
        </>
      )}
    </div>
  );
}