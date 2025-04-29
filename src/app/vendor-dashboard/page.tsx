"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
  DocumentReference,
  doc,
  limit,
  orderBy,
} from "firebase/firestore";
import Image from 'next/image';
import styles from "./styles.module.css";
import Sidebar from './components/Sidebar';
import PopUpsSection from './components/PopUpsSection';
import FinancialOverview from './components/FinancialOverview';
import ApplicationStatus from './components/ApplicationStatus';

// Define types for fetched data (adjust based on actual structure)
interface Application {
  id: string;
  eventId: DocumentReference;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  eventName?: string; // Will be added after fetching event
}

interface Event {
  id: string;
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: { city: string; state: string }; // Assuming location structure
  // Add other fields as needed
}

const VendorDashboard = () => {
  const { user, vendorProfile } = useUserContext();
  const [acceptedEvents, setAcceptedEvents] = useState<Event[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [currentMonthName, setCurrentMonthName] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentMonthName(date.toLocaleString('default', { month: 'long' }));
  }, []);

  // Fetch accepted pop-ups for the current month
  useEffect(() => {
    const fetchAcceptedEvents = async () => {
      if (!user || !vendorProfile?.id) return;
      setLoadingEvents(true);
      try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const vendorProfileRef = doc(db, "vendorProfile", vendorProfile.id);

        const q = query(
          collection(db, "applications"),
          where("vendorProfile", "==", vendorProfileRef),
          where("status", "==", "ACCEPTED")
        );
        const querySnapshot = await getDocs(q);
        const eventsPromises = querySnapshot.docs.map(async (appDoc) => {
          const appData = appDoc.data();
          if (appData.eventId instanceof DocumentReference) {
            const eventSnap = await getDoc(appData.eventId);
            if (eventSnap.exists()) {
              const eventData = eventSnap.data() as Omit<Event, 'id'>; // Cast to ensure type
              // Check if event is in the current month
              const startDate = eventData.startDate.toDate();
              if (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) {
                return { ...eventData, id: eventSnap.id };
              }
            }
          }
          return null;
        });
        const events = (await Promise.all(eventsPromises)).filter(event => event !== null) as Event[];
        setAcceptedEvents(events);
      } catch (error) {
        console.error("Error fetching accepted events:", error);
        setAcceptedEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchAcceptedEvents();
  }, [user, vendorProfile]);

  // Fetch recent applications
  useEffect(() => {
    const fetchRecentApplications = async () => {
       if (!user || !vendorProfile?.id || !vendorProfile.applications || vendorProfile.applications.length === 0) {
          setLoadingApplications(false);
          return;
        }
      setLoadingApplications(true);
      try {
        // Get the last 4 application references
        const appRefs = vendorProfile.applications.slice(-4).reverse();

        const appsPromises = appRefs.map(async (appRef: DocumentReference) => {
          if (!(appRef instanceof DocumentReference)) return null; // Skip if not a valid reference

          const appSnap = await getDoc(appRef);
          if (appSnap.exists()) {
            const appData = appSnap.data();
            let eventName = "Event Name Unavailable";
            if (appData.eventId instanceof DocumentReference) {
              try {
                const eventSnap = await getDoc(appData.eventId);
                if (eventSnap.exists()) {
                  eventName = eventSnap.data().name || eventName;
                }
              } catch (eventError) {
                console.error("Error fetching event name for application:", appRef.id, eventError);
              }
            }
            return {
              id: appSnap.id,
              status: appData.status,
              eventId: appData.eventId,
              eventName: eventName
            } as Application;
          }
          return null;
        });

        const applications = (await Promise.all(appsPromises)).filter(app => app !== null) as Application[];
        setRecentApplications(applications);
      } catch (error) {
        console.error("Error fetching recent applications:", error);
        setRecentApplications([]);
      } finally {
        setLoadingApplications(false);
      }
    };
    fetchRecentApplications();
  }, [user, vendorProfile]);

  const formatDate = (date: Timestamp | undefined) => {
    if (!date) return "N/A";
    return date.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Timestamp | undefined) => {
    if (!date) return "N/A";
    return date.toDate().toLocaleTimeString("en-US", {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  const getStatusPillStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED": return styles.statusAccepted;
      case "PENDING": return styles.statusPending;
      case "REJECTED": return styles.statusDeclined;
      default: return styles.statusDefault;
    }
  };

  return (
    <main className={`global-background ${styles.dashboardGrid}`}>
      <Sidebar 
        user={user}
        vendorProfile={vendorProfile}
      />

      {/* Main Content Area */}
      <section className={styles.mainContent}>
        <PopUpsSection
          currentMonthName={currentMonthName}
          loadingEvents={loadingEvents}
          acceptedEvents={acceptedEvents}
          formatDate={formatDate}
          formatTime={formatTime}
        />

        {/* Event Calendar Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Event Calendar</h2>
          <div className={styles.calendarPlaceholder}>
            Calendar Placeholder - Implementation Coming Soon
          </div>
        </div>
      </section>

      {/* Right Panel */}
      <aside className={styles.rightPanel}>
        <FinancialOverview vendorProfile={vendorProfile} />
        <ApplicationStatus
          loadingApplications={loadingApplications}
          recentApplications={recentApplications}
          getStatusPillStyle={getStatusPillStyle}
        />
      </aside>
    </main>
  );
};

export default VendorDashboard;
