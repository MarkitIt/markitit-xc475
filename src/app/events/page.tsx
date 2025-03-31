'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Ensure correct Firebase import
import { collection, getDocs } from "firebase/firestore";
import { SearchBar } from "@/components/SearchBar";
import { EventCard } from "@/components/EventCard";
import Image from "next/image";
import styles from "@/app/events/page.module.css"; // Updated CSS import
import "@/app/tailwind.css"; // Ensure Tailwind is applied globally
import "leaflet/dist/leaflet.css";
import { useUserContext } from "@/context/UserContext";

interface Event {
  id: string;
  name: string;
  image: string;
  date: string;
  location: {
    city: string;
    state: string;
  };
  score: number;
}

export default function EventsPage() {
  const { user, vendorProfile } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const [rankedEvents, setRankedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // For users with vendor profiles, fetch directly from the rankEvents API
        if (user && vendorProfile) {
          console.log("🔍 Fetching ranked events from API for vendor ID:", user.uid);
          console.log("🧩 Using vendor profile with vendor ID:", vendorProfile.uid);
          
          const response = await fetch("/api/rankEvents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendorId: user.uid }),
          });
          
          const data = await response.json();
          
          // Log full API response for debugging
          console.log("API Response:", data);
          
          if (data.rankedEvents && Array.isArray(data.rankedEvents)) {
            console.log("First ranked event:", data.rankedEvents[0]);
            console.log("Score of first event:", data.rankedEvents[0].score);
            console.log("Total events returned:", data.rankedEvents.length);
            
            // IMPORTANT: Use the events DIRECTLY from the API without any transformation
            const apiEvents = data.rankedEvents;
            
            // Keep the original sorting from the API (should already be sorted by score)
            setEvents(apiEvents);
            setFilteredEvents(apiEvents);
            setRankedEvents(apiEvents);
          } else {
            console.error("Invalid or empty API response:", data);
          }
        } else {
          // Non-vendor users get unsorted events from Firestore
          const eventsSnapshot = await getDocs(collection(db, 'events'));
          const eventList = eventsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Event));
          
          setEvents(eventList);
          setFilteredEvents(eventList);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setIsLoading(false);
    };

    fetchEvents();
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
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Welcome to MarkitIt!.
          </li>
          <li>From xc475</li>
        </ol>

        {!user && (
          <div className="text-center p-4 bg-yellow-100 text-yellow-800">
            Events are not ranked. Please log in to see personalized recommendations.
          </div>
        )}
        
        {user && !vendorProfile && (
          <div className="text-center p-4 bg-yellow-100 text-yellow-800">
            Events are not ranked as vendor profile not found. Create a profile to see personalized recommendations.
          </div>
        )}

        <SearchBar onSearch={handleSearch} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {currentEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              rank={rankedEvents.findIndex(e => e.id === event.id) + 1}
              showRank={!!user && !!vendorProfile}
              score={event.score}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <h2>Ranked Events</h2>
        <ul>
          {rankedEvents && rankedEvents.length > 0 ? (
            rankedEvents.map(event => (
              <li key={event.id}>{event.name}</li>
            ))
          ) : (
            <p>No ranked events found.</p>
          )}
        </ul>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
