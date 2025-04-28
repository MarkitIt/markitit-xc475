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
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.profileCard}>
          <div className={styles.profilePic}>
            {/* Placeholder for profile picture */}
            {user?.photoURL ? (
               <Image src={user.photoURL} alt="Profile" width={80} height={80} style={{ borderRadius: '50%' }}/>
             ) : (
               <div className={styles.profilePicPlaceholder}></div>
             )}
          </div>
          <h3 className={styles.profileName}>{vendorProfile?.contactName || "Vendor Name"}</h3>
          <p className={styles.businessName}>{vendorProfile?.businessName || "Business Name"}</p>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#" className={styles.navLink}>Upcoming Events</a>
          <a href="#" className={styles.navLink}>My Applications</a>
          <a href="#" className={styles.navLink}>Financial Overview</a>
          <a href="#" className={styles.navLink}>Feed</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className={styles.mainContent}>
        {/* Your Pop-Ups Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Pop-Ups in {currentMonthName}</h2>
          {loadingEvents ? (
            <p>Loading events...</p>
          ) : acceptedEvents.length > 0 ? (
            <div className={styles.eventsGrid}>
              {acceptedEvents.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <h4>{event.name}</h4>
                  <p><strong>DATE:</strong> {formatDate(event.startDate)}</p>
                  <p><strong>TIME:</strong> {formatTime(event.startDate)} - {formatTime(event.endDate)}</p>
                  <p><strong>PLACE:</strong> {event.location?.city}, {event.location?.state}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noDataMessage}>No accepted pop-ups this month.</p>
          )}
        </div>

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
        {/* Financial Overview Section */}
        <div className={styles.financialCard}>
          <h3 className={styles.rightPanelTitle}>Financial overview</h3>
          <p>This Month</p>
          <p>You have attended <strong>{vendorProfile?.applications?.length || 0}</strong> Pop Ups</p>
          <div className={styles.financeDetails}>
            <div className={styles.financeItem}>
              <h4>Costs</h4>
              <p className={styles.placeholderText}>$XXX.XX</p> {/* Placeholder */}
            </div>
            <div className={styles.financeItem}>
              <h4>Revenue</h4>
              <p className={styles.placeholderText}>$XXX.XX</p> {/* Placeholder */}
            </div>
          </div>
        </div>

        {/* Application Status Section */}
        <div className={styles.applicationStatusCard}>
          <h3 className={styles.rightPanelTitle}>Application Status</h3>
           {loadingApplications ? (
            <p>Loading applications...</p>
          ) : recentApplications.length > 0 ? (
             <ul className={styles.appList}>
               {recentApplications.map((app) => (
                 <li key={app.id} className={styles.appListItem}>
                   <span>{app.eventName}</span>
                   <span className={`${styles.statusPill} ${getStatusPillStyle(app.status)}`}>
                     {app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()}
                   </span>
                 </li>
               ))}
             </ul>
           ) : (
             <p>No recent applications found.</p>
           )}
        </div>
      </aside>
    </main>
  );
};

export default VendorDashboard;
