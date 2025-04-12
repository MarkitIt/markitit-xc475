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
import { eventTypes } from '@/types/EventTypes';
import { attendeeTypes } from '@/types/AttendeeTypes';
import { categories } from '@/types/Categories';
import { demographics } from '@/types/Demographics';
import { priceRanges } from '@/types/Price';





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

  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAttendeeType, setSelectedAttendeeType] = useState('');
  const [selectedDemographic, setSelectedDemographic] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

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
      const eventTypeMatch = selectedEventType ? event.type?.includes(selectedEventType) : true;
      const categoryMatch = selectedCategory ? event.categories?.includes(selectedCategory) : true;
      const attendeeTypeMatch = selectedAttendeeType
        ? event.attendeeType?.includes(selectedAttendeeType)
        : true;
      const demographicMatch = selectedDemographic
        ? event.demographics?.includes(selectedDemographic)
        : true;
        const priceMatch = selectedPrice
        ? (event.vendorFee ?? 0) >= priceRanges[Number(selectedPrice)].min &&
          (event.vendorFee ?? 0) <= priceRanges[Number(selectedPrice)].max
        : true;

      return eventTypeMatch && categoryMatch && attendeeTypeMatch && demographicMatch && priceMatch;
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
    <div style={{ 
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.main,
      minHeight: '100vh',
      fontFamily: theme.typography.fontFamily.primary
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: theme.spacing.lg,
        color: theme.colors.primary.black,
        fontWeight: theme.typography.fontWeight.bold
      }}>
        Find Events
      </h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {/* Event Type Dropdown */}
        <select
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          {/* Default option */}
          <option value="" disabled>
            Select Event Type
          </option>
          {/* None option */}
          <option value="">None</option>
          {eventTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Attendee Type Dropdown */}
        <select
          value={selectedAttendeeType}
          onChange={(e) => setSelectedAttendeeType(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="" disabled>
            Select Attendee Type
          </option>
          <option value="">None</option>
          {attendeeTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Demographic Dropdown */}
        <select
          value={selectedDemographic}
          onChange={(e) => setSelectedDemographic(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="" disabled>
            Select Demographic
          </option>
          <option value="">None</option>
          {demographics.map((demo, index) => (
            <option key={index} value={demo}>
              {demo}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="">None</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Price Range Dropdown */}
        <select
          value={selectedPrice}
          onChange={(e) => setSelectedPrice(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="" disabled>
            Select Price Range
          </option>
          <option value="">None</option>
          {priceRanges.map((price, index) => (
            <option key={index} value={index}>
              {price.label}
            </option>
          ))}
        </select>

        {/* Apply Filters Button */}
        <button
          onClick={handleFilter}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: theme.spacing.xl,
          color: theme.colors.text.secondary
        }}>
          Loading events...
        </div>
      ) : error ? (
        <div style={{ 
          color: theme.colors.primary.coral,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.lg
        }}>
          {error}
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.xl
          }}>
            {currentEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
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
            <div style={{ 
              textAlign: 'center',
              padding: theme.spacing.xl,
              backgroundColor: theme.colors.background.white,
              borderRadius: theme.borderRadius.md,
              color: theme.colors.text.secondary,
              fontWeight: theme.typography.fontWeight.medium
            }}>
              No events found matching your criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
}