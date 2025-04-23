'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { EventCard } from '@/components/EventCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from './components/Pagination';
import { useUserContext } from '@/context/UserContext';
import { fetchEventRankings } from '@/utils/fetchEventRankings';
import styles from './styles.module.css';
import { Event } from '@/types/Event';
import { parseEventDate, getCityState } from "@/utils/inferEventData";
import { useRouter } from 'next/navigation';
import { theme } from '@/styles/theme';

export default function SearchEvents() {
  const { theme } = useTheme();
  const { user, vendorProfile } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const eventsPerPage = 9;

  // Calculate current events to display based on pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Fetching events from API if user has vendor profile, otherwise from Firestore
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      
      try {
        let eventsList = [];
        
        if (user && vendorProfile) {
          // Fetch ranked events from API
          const rankingResponse = await fetchEventRankings(user.uid);
          
          if (rankingResponse.error) {
            throw new Error(rankingResponse.error);
          }
          
          // Map the ranked events to include score
          eventsList = rankingResponse.data.rankedEvents.map((event: any) => ({
            ...event,
            score: event.scoreBreakdown.total * 100 // Convert to percentage
          }));
          
          // Sort by score (highest first)
          eventsList.sort((a: any, b: any) => b.score - a.score);
          
        } else {
          // Fetch from Firestore for non-vendor users
          const querySnapshot = await getDocs(collection(db, "events"));
          eventsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        
        setEvents(eventsList);
        setFilteredEvents(eventsList);
      } catch (err) {
        console.error("Error fetching events: ", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, [user, vendorProfile]);

  // Handle search
  const handleSearch = (city: string, startDate: string, endDate: string, keywords: string) => {
    //setSearchQuery(query);
    setCurrentPage(1);
    
    if (!city.trim() && !startDate.trim() && !endDate.trim() && !keywords.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const formatDate = (timestamp: any) => {
      if (!timestamp) return null;
      return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US"); // Format to mm/dd/yyyy
    };

    //const lowercaseQuery = query.toLowerCase();
    const filtered = events.filter(event => {

      // Check city
      const cityMatch = city
      ? event.location?.city?.toLowerCase().includes(city.toLowerCase())
      : true;

      // Check start date
      const startDateMatch = startDate
        ? event.startDate?.seconds &&
          formatDate(event.startDate) && new Date(formatDate(event.startDate)!) >= new Date(startDate)
        : true;

      // Check end date
      const endDateMatch = endDate
        ? event.endDate?.seconds &&
          formatDate(event.endDate) && new Date(formatDate(event.endDate)!) <= new Date(endDate)
        : true;

      // Check keywords in name or description
      const keywordsMatch = keywords
        ? event.name?.toLowerCase().includes(keywords.toLowerCase()) ||
          event.description?.toLowerCase().includes(keywords.toLowerCase())
        : true;

      return cityMatch && startDateMatch && endDateMatch && keywordsMatch;
    });
    console.log(filtered);
    
    setFilteredEvents(filtered);
  };

  const handleFilter = () => {
    const filtered = events.filter((event) => {
      const typeMatch = selectedType ? event.type?.includes(selectedType) : true;
      const cityMatch = selectedCity ? event.location?.city === selectedCity : true;
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
        <button
          onClick={handleFilter}
          className="search-button"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="loading-message">
          Loading events...
        </div>
      ) : error ? (
        <div className="error-message">
          {error}
        </div>
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
          
          {filteredEvents.length === 0 && (
            <div className="no-results-message">
              No events found matching your criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
}