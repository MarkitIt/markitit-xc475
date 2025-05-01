"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  Timestamp,
  DocumentReference,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import "../../tailwind.css";
import { useUserContext } from "@/context/UserContext";
import "react-circular-progressbar/dist/styles.css";
import { fetchEventRankings } from "@/utils/fetchEventRankings";
import styles from './styles.module.css';
import EventHeader from './components/EventHeader';
import EventDetails from './components/EventDetails';
import ScoreBreakdown from './components/ScoreBreakdown';

const PRIORITY_MAP: Record<string, string> = {
  "Expected Attendance & Event Size": "eventSizeScore",
  "Location": "locationScore",
  "Costs": "budgetScore",
  "Target Audience": "demographicsScore",
  "Vendor Count (Competition)": "eventSizeScore",
};

// Max points for each score type (should match backend logic)
const maxPoints: Record<string, number> = {
  eventTypeScore: 15,
  locationScore: 20,
  budgetScore: 20,
  demographicsScore: 15,
  eventSizeScore: 10,
  scheduleScore: 10,
  vendorCategoryScore: 10,
};

export default function EventProfilePage() {
  const router = useRouter();
  const params = useParams();
  let idParam = "";
  try {
    idParam = decodeURIComponent(params.id as string);
  } catch (err) {
    console.error("Error decoding params.id:", err);
  }
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, vendorProfile } = useUserContext();
  const [isClient, setIsClient] = useState(false);
  const [userScoreBreakdown, setUserScoreBreakdown] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<null | "PENDING" | "ACCEPTED" | "REJECTED">(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, "eventsFormatted", idParam);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ ...docSnap.data(), id: docSnap.id });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Error loading event");
      } finally {
        setLoading(false);
      }
    };
    if (idParam) fetchEvent();
  }, [idParam]);

  useEffect(() => {
    const fetchUserScore = async () => {
      if (!user || !event?.id) return;
      try {
        const rankingResponse = await fetchEventRankings(user.uid);
        if (rankingResponse && rankingResponse.data && rankingResponse.data.rankedEvents) {
          const found = rankingResponse.data.rankedEvents.find((e: any) => e.id === event.id);
          if (found && found.scoreBreakdown) {
            setUserScoreBreakdown(found.scoreBreakdown);
          }
        }
      } catch (err) {
        setUserScoreBreakdown(null);
      }
    };
    fetchUserScore();
  }, [user, event?.id]);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!user || !event?.id) return;
      try {
        const eventRef = doc(db, "eventsFormatted", event.id);
        const q = query(
          collection(db, "applications"),
          where("eventId", "==", eventRef),
          where("vendorId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const appDoc = querySnapshot.docs[0];
          setApplicationStatus(appDoc.data().status);
        } else {
          setApplicationStatus(null);
        }
      } catch (err) {
        setApplicationStatus(null);
      }
    };
    fetchApplicationStatus();
  }, [user, event?.id]);

  const formatDate = (date: { seconds: number; nanoseconds: number } | undefined) => {
    if (!date) return "";
    const eventDate = new Date(date.seconds * 1000);
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderBoothFees = (fees: any) => {
    if (!fees || typeof fees !== "object" || Array.isArray(fees) || Object.keys(fees).length === 0) {
      return <span>N/A</span>;
    }
    return (
      <ul>
        {Object.entries(fees).map(([label, price]) => (
          <li key={label}>
            <strong>{label}:</strong> ${typeof price === "number" ? price : String(price)}
          </li>
        ))}
      </ul>
    );
  };

  const handleVerifiedApply = async () => {
    if (!user || !vendorProfile || !event?.id || !event?.hostProfile) {
      alert("Error: Missing required information to apply.");
      return;
    }
    if (!(event.hostProfile instanceof DocumentReference)) {
      alert("Error: Invalid host profile data.");
      return;
    }

    setIsSubmitting(true);
    try {
      const eventRef = doc(db, "eventsFormatted", event.id);
      const vendorProfileRef = doc(db, "vendorProfile", vendorProfile.id);
      const hostProfileRef = event.hostProfile as DocumentReference;

      const applicationData = {
        eventId: eventRef,
        hostProfile: hostProfileRef,
        vendorProfile: vendorProfileRef,
        status: "PENDING",
        createdAt: Timestamp.now(),
        vendorId: user.uid
      };
      const newApplicationRef = await addDoc(collection(db, "applications"), applicationData);

      await updateDoc(vendorProfileRef, {
        applications: arrayUnion(newApplicationRef)
      });

      await updateDoc(hostProfileRef, {
        applications: arrayUnion(newApplicationRef)
      });

      setApplicationStatus("PENDING");
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  let buttonText = "Apply Now";
  let disabled = false;
  if (applicationStatus === "PENDING") {
    buttonText = "Applied!";
    disabled = true;
  } else if (applicationStatus === "ACCEPTED") {
    buttonText = "Accepted!";
    disabled = true;
  } else if (applicationStatus === "REJECTED") {
    buttonText = "Rejected";
    disabled = true;
  } else if (isSubmitting) {
    buttonText = "Applying...";
    disabled = true;
  }

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return null;

  const userPriorityKeys = (vendorProfile?.eventPriorityFactors || [])
    .map((factor: string) => PRIORITY_MAP[factor])
    .filter(Boolean);

  return (
    <div className={styles.container}>
      <EventHeader
        event={event}
        applicationStatus={applicationStatus}
        isSubmitting={isSubmitting}
        handleVerifiedApply={handleVerifiedApply}
        disabled={disabled}
        buttonText={buttonText}
      />
      
      <EventDetails
        event={event}
        formatDate={formatDate}
        renderBoothFees={renderBoothFees}
      />

      {userScoreBreakdown && (
        <ScoreBreakdown
          userScoreBreakdown={userScoreBreakdown}
          maxPoints={maxPoints}
          userPriorityKeys={userPriorityKeys}
        />
      )}
    </div>
  );
}
