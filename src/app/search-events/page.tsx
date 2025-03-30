'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SearchBar } from '@/components/SearchBar';
import { EventCard } from '@/components/EventCard';
import Image from "next/image";
import { theme } from '@/styles/theme';
import "leaflet/dist/leaflet.css";
import { useUserContext } from '@/context/UserContext';
import { Pagination } from './components/Pagination';
import { Recommendations } from './components/Recommendations';
import styles from './styles.module.css';

interface Event {
  id: string;
  name: string;
  image: string;
  date: string;
  location: {
    city: string;
    state: string;
  };
}

export default function SearchEventsPage() {
  const { user, vendorProfile } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const [rankedEvents, setRankedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAndRankEvents = async () => {
      try {
        // Fetch base events
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Event));
        setEvents(eventList);
        setFilteredEvents(eventList);

        // Rank events if user has vendor profile
        if (user && vendorProfile) {
          const response = await fetch("/api/rankEvents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendorId: user.uid }),
          });
          const data = await response.json();
          if (data.success) {
            setRankedEvents(data.rankedEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching events:"/*, error*/);
      }
    };

    fetchAndRankEvents();
  }, [user, vendorProfile]);

  const handleSearch = (city: string, startDate: string, endDate: string, keywords: string) => {
    let filtered = [...events];

    if (city) {
      filtered = filtered.filter(event => 
        event.location.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return eventDate >= start && eventDate <= end;
      });
    }

    if (keywords) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(keywords.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Image
            src="/icons/home.svg"
            alt="MarkitIt Logo"
            width={240}
            height={50}
            priority
            className={styles.logo}
          />
          <div className={styles.welcomeContainer}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={theme.colors.primary.black}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path d="M9 22V12h6v10" />
            </svg>
            <h1 className={styles.welcomeTitle}>
              Welcome to MarkitIt!
            </h1>
          </div>
        </div>

        {!user && (
          <div className={styles.alert}>
            Events are not ranked. Please log in to see personalized recommendations.
          </div>
        )}
        
        {user && !vendorProfile && (
          <div className={styles.alert}>
            Events are not ranked as vendor profile not found. Create a profile to see personalized recommendations.
          </div>
        )}

        <SearchBar onSearch={handleSearch} />
        
        <div className={styles.eventsGrid}>
          {currentEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              rank={rankedEvents.findIndex(e => e.id === event.id) + 1}
              showRank={!!user && !!vendorProfile}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredEvents.length / eventsPerPage)}
          onPageChange={paginate}
        />

        <Recommendations events={rankedEvents} />
      </main>
    </div>
  );
}