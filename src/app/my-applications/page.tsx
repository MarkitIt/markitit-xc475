"use client";

import { ApplicationCard } from "./components/ApplicationCard";
import { useEffect, useState } from "react";
import "@/styles/theme";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useUserContext } from "@/context/UserContext";
import { getDoc, Timestamp, DocumentReference } from "firebase/firestore";
import styles from "./styles.module.css";

interface Application {
  id: string;
  eventId: DocumentReference;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  submissionDate?: string;
  eventName?: string;
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const { vendorProfile } = useUserContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!vendorProfile?.applications || vendorProfile.applications.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }
      try {
        // Most recent first
        const appRefs = vendorProfile.applications.slice().reverse();
        const apps = await Promise.all(
          appRefs.map(async (appRef: DocumentReference) => {
            if (!(appRef instanceof DocumentReference)) return null;
            const appSnap = await getDoc(appRef);
            if (!appSnap.exists()) return null;
            const appData = appSnap.data();
            let eventName = "Event Name Unavailable";
            let submissionDate = "N/A";
            if (appData.eventId instanceof DocumentReference) {
              try {
                const eventSnap = await getDoc(appData.eventId);
                if (eventSnap.exists()) {
                  eventName = eventSnap.data().name || eventName;
                }
              } catch {}
            }
            if (appData.createdAt instanceof Timestamp) {
              submissionDate = appData.createdAt.toDate().toLocaleDateString();
            }
            return {
              id: appSnap.id,
              eventId: appData.eventId,
              status: appData.status,
              submissionDate,
              eventName,
            } as Application;
          })
        );
        setApplications(apps.filter(Boolean) as Application[]);
      } catch (error) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [vendorProfile]);

  const handleViewDetails = (applicationId: string) => {
    router.push(`/my-applications/${applicationId}/detail`);
  };

  const handleNewApplication = () => {
    router.push("/search-events");
  };

  return (
    <main className="global-background">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Applications</h1>
          <button onClick={handleNewApplication} className={styles.newButton}>
            Find Events
          </button>
        </div>
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length > 0 ? (
          <div className={styles.applicationsList}>
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                eventName={application.eventName || "Event Name Unavailable"}
                status={application.status}
                submissionDate={application.submissionDate || "N/A"}
                onViewDetails={() => handleViewDetails(application.id)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>You haven't applied to any events yet.</p>
            <p>Browse available events and submit your first application!</p>
          </div>
        )}
      </div>
    </main>
  );
}
