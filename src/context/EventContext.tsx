'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CustomQuestion {
  title: string;
  description: string;
  isRequired: boolean;
}

interface EventContextProps {
  event: any | null;
  customQuestions: CustomQuestion[] | null;
  loading: boolean;
  error: string | null;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { id } = useParams(); // Get eventId from the URL
  const eventId = Array.isArray(id) ? id[0] : id; // Ensure eventId is a string
  const [event, setEvent] = useState<any | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('Event ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const eventDocRef = doc(db, 'events', String(eventId)); // Ensure eventId is a string
        const eventDocSnap = await getDoc(eventDocRef);

        if (eventDocSnap.exists()) {
          const eventData = eventDocSnap.data();
          setEvent({ id: eventDocSnap.id, ...eventData });

          // Extract customQuestions if available
          setCustomQuestions(eventData.customQuestions || []);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to fetch event data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <EventContext.Provider value={{ event, customQuestions, loading, error }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = (): EventContextProps => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};