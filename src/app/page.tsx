'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SearchBar } from '@/components/SearchBar';
import { EventCard } from '@/components/EventCard';
import Image from "next/image";
import styles from "./page.module.css";
import './tailwind.css';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Event));
      setEvents(eventList);
      setFilteredEvents(eventList);
    };

    fetchEvents();
  }, []);

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

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>

        <SearchBar onSearch={handleSearch} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p>No events found matching your search criteria.</p>
          )}
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
