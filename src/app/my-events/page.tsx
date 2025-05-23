"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { SearchBar } from "@/components/SearchBar";
import { EventCardHost } from "@/components/EventCardHost";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import "../tailwind.css";
import "leaflet/dist/leaflet.css";
import { useUserContext } from "@/context/UserContext";

import { theme } from "@/styles/theme";

interface Event {
  id: string;
  name: string;
  image: string;
  date: string;
  location: {
    city: string;
    state: string;
  };
  uid: string; // Added property to match the filter condition
}

export default function ApplicationHostProfile() {
  const router = useRouter();
  const { user, vendorProfile } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const [rankedEvents, setRankedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false); // New state for redirection

  useEffect(() => {
    const fetchAndRankEvents = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          console.warn("User is not logged in.");
          setIsLoading(false);
          return;
        }

        // Fetch events where userId matches the current user's ID
        const eventsQuery = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventList = eventsSnapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Event,
          )
          .filter((event) => event.uid === user.uid); // Filter by user ID

        setEvents(eventList);
        setFilteredEvents(eventList);

        // Rank events if user has a vendor profile
        if (vendorProfile) {
          const response = await fetch("/api/rankEvents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid }),
          });
          const data = await response.json();
          if (data.success) {
            setRankedEvents(data.rankedEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setIsLoading(false);
    };

    fetchAndRankEvents();
  }, [user, vendorProfile]);

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent,
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: theme.spacing.xl,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.xl,
        }}
      >
        <h1
          style={{
            fontSize: theme.typography.fontSize.title,
            color: theme.colors.text.primary,
          }}
        >
          My Events
        </h1>

        <button
          onClick={() => router.push("/my-events/create-application")}
          style={{
            //backgroundColor: theme.colors.primary.coral,
            color: theme.colors.background.white,
            padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            border: "none",
            cursor: "pointer",
            fontSize: theme.typography.fontSize.body,
          }}
        >
          New Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {currentEvents.map((event) => (
          <EventCardHost key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from({
          length: Math.ceil(filteredEvents.length / eventsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
