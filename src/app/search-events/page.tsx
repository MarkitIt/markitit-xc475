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

export default function Home() {
  const { user, vendorProfile } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const [rankedEvents, setRankedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndRankEvents = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.colors.background.main,
      fontFamily: theme.typography.fontFamily.primary,
    }}>
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: theme.spacing.xxl,
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xxl,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing.lg,
        }}>
          <Image
            src="/icons/home.svg"
            alt="MarkitIt Logo"
            width={240}
            height={50}
            priority
            style={{
              marginBottom: theme.spacing.md,
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.background.white,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
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
            <h1 style={{
              fontSize: theme.typography.fontSize.header,
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.semibold,
              margin: 0,
            }}>
              Welcome to MarkitIt!
            </h1>
          </div>
        </div>

        {!user && (
          <div style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.secondary.lightPink,
            color: theme.colors.primary.coral,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.xl,
            textAlign: 'center',
          }}>
            Events are not ranked. Please log in to see personalized recommendations.
          </div>
        )}
        
        {user && !vendorProfile && (
          <div style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.secondary.lightPink,
            color: theme.colors.primary.coral,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.xl,
            textAlign: 'center',
          }}>
            Events are not ranked as vendor profile not found. Create a profile to see personalized recommendations.
          </div>
        )}

        <SearchBar onSearch={handleSearch} />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: theme.spacing.xl,
          marginTop: theme.spacing.xl,
        }}>
          {currentEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              rank={rankedEvents.findIndex(e => e.id === event.id) + 1}
              showRank={!!user && !!vendorProfile}
            />
          ))}
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: theme.spacing.sm,
          marginTop: theme.spacing.xxl,
        }}>
          {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                border: 'none',
                backgroundColor: currentPage === index + 1 
                  ? theme.colors.primary.black 
                  : theme.colors.background.white,
                color: currentPage === index + 1 
                  ? theme.colors.background.white 
                  : theme.colors.text.primary,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {rankedEvents && rankedEvents.length > 0 && (
          <div style={{
            marginTop: theme.spacing.xxl,
          }}>
            <h2 style={{
              fontSize: theme.typography.fontSize.header,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
            }}>
              Recommended Events
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}>
              {rankedEvents.map(event => (
                <li 
                  key={event.id}
                  style={{
                    padding: theme.spacing.md,
                    borderBottom: `1px solid ${theme.colors.primary.beige}`,
                    color: theme.colors.text.primary,
                  }}
                >
                  {event.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}