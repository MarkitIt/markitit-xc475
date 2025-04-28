"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
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
import Link from "next/link";
import { db } from "../../../lib/firebase";
import "../../tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faInfoCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "@/context/UserContext";
import Image from "next/image";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchEventRankings } from "@/utils/fetchEventRankings";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Pill component for tags
const Pill = ({ children, color = "#f3f4f6" }: { children: ReactNode; color?: string }) => (
  <span style={{
    display: "inline-block",
    background: color,
    color: "#374151",
    borderRadius: "9999px",
    padding: "0.25em 0.75em",
    fontSize: "0.95em",
    margin: "0 0.25em 0.25em 0",
    fontWeight: 500,
    border: "1px solid #e5e7eb"
  }}>{children}</span>
);

const PRIORITY_MAP: Record<string, string> = {
  "Expected Attendance & Event Size": "eventSizeScore",
  "Location": "locationScore",
  "Costs": "budgetScore",
  "Target Audience": "demographicsScore",
  "Vendor Count (Competition)": "eventSizeScore",
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
  const [activeTab, setActiveTab] = useState<"Event" | "Reviews">("Event");
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
        // Fetch from eventsFormatted by doc ID
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

  // Fetch user-specific score breakdown from rankEvents
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

  // Fetch application status for this event and vendor
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

  const renderScoreBreakdownChart = () => {
    if (!event?.scoreBreakdown || typeof event.scoreBreakdown !== "object" || Object.keys(event.scoreBreakdown).length === 0)
      return null;
    const breakdownEntries = Object.entries(event.scoreBreakdown).filter(
      ([key, val]) => key !== "total" && typeof val === "number"
    );
    const data = {
      labels: breakdownEntries.map(([k]) => k),
      datasets: [
        {
          label: "Score Breakdown",
          data: breakdownEntries.map(([_, v]) => v),
          backgroundColor: "#60a5fa",
        },
      ],
    };
    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Why This Event Got This Score",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 20,
        },
      },
    };
    return <Bar data={data} options={options} />;
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
    // pastEventScore, headcountScore, categoryScore, vendorsNeededScore, descriptionScore are not shown
  };

  const userPriorityKeys = (vendorProfile?.eventPriorityFactors || [])
    .map((factor: string) => PRIORITY_MAP[factor])
    .filter(Boolean);

  // Function to handle one-click application for verified hosts
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
      const vendorProfileRef = doc(db, "vendorProfile", vendorProfile.id); // Assuming vendorProfile has an 'id' field
      const hostProfileRef = event.hostProfile as DocumentReference; // Already a ref

      // 1. Create application document
      const applicationData = {
        eventId: eventRef,
        hostProfile: hostProfileRef,
        vendorProfile: vendorProfileRef,
        status: "PENDING",
        createdAt: Timestamp.now(),
        vendorId: user.uid
      };
      const newApplicationRef = await addDoc(collection(db, "applications"), applicationData);

      // 2. Update vendor profile
      await updateDoc(vendorProfileRef, {
        applications: arrayUnion(newApplicationRef)
      });

      // 3. Update host profile
      await updateDoc(hostProfileRef, {
        applications: arrayUnion(newApplicationRef)
      });

      setApplicationStatus("PENDING"); // Update UI immediately
      alert("Application submitted successfully!");
      // Optionally, redirect the user or update UI state
      // router.push('/my-applications'); 

    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Button rendering logic for verified host
  let buttonText = "Apply Now";
  let buttonColor = "var(--primary-coral, #f87171)";
  let disabled = false;
  if (applicationStatus === "PENDING") {
    buttonText = "Applied!";
    buttonColor = "#d1d5db"; // gray
    disabled = true;
  } else if (applicationStatus === "ACCEPTED") {
    buttonText = "Accepted!";
    buttonColor = "#22c55e"; // green
    disabled = true;
  } else if (applicationStatus === "REJECTED") {
    buttonText = "Rejected";
    buttonColor = "#f87171"; // red
    disabled = true;
  } else if (isSubmitting) {
    buttonText = "Applying...";
    buttonColor = "#fbbf24";
    disabled = true;
  }

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: 0 }}>
      {/* Top section: Image + Name/Description + Contact Button */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start", marginBottom: 32 }}>
        {/* Event Image */}
        <div style={{ flex: "0 0 340px", minWidth: 280, maxWidth: 400, borderRadius: 18, overflow: "visible", background: "#f3f4f6", boxShadow: "0 2px 8px #0001", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: 24 }}>
          {event.image ? (
            <Image src={event.image} alt={event.name} width={400} height={260} style={{ objectFit: "cover", width: "100%", height: 260, borderTopLeftRadius: 18, borderTopRightRadius: 18 }} />
          ) : (
            <span style={{ color: "#9ca3af", fontSize: 18 }}>No Image</span>
          )}
          
          {/* Application Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18, width: "100%", padding: "0 20px", alignItems: "center" }}>
            {event?.hostProfile ? (
              <button
                onClick={handleVerifiedApply}
                disabled={disabled}
                style={{
                  background: buttonColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontWeight: 600,
                  fontSize: 18,
                  cursor: disabled ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px #f8717133",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  position: "relative",
                  width: "100%"
                }}
                onMouseOver={e => !disabled && (e.currentTarget.style.background = "#fb7185")}
                onMouseOut={e => !disabled && (e.currentTarget.style.background = "var(--primary-coral, #f87171)")}
                title={
                  applicationStatus === "PENDING" ? "You have already applied to this event."
                  : applicationStatus === "ACCEPTED" ? "Your application was accepted!"
                  : applicationStatus === "REJECTED" ? "Your application was rejected."
                  : isSubmitting ? "Submitting..." : "This is a verified host, click for one-click apply."
                }
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                {buttonText}
                {applicationStatus === null && !isSubmitting && (
                  <FontAwesomeIcon icon={faStar} style={{ color: "#fbbf24", position: "absolute", right: 12 }} />
                )}
              </button>
            ) : (
              <button
                onClick={() => event?.applicationLink && window.open(event.applicationLink, '_blank')}
                style={{
                  background: event?.applicationLink ? "var(--primary-coral, #f87171)" : "#e5e7eb",
                  color: event?.applicationLink ? "#fff" : "#9ca3af",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 22px",
                  fontWeight: 600,
                  fontSize: 18,
                  cursor: event?.applicationLink ? "pointer" : "not-allowed",
                  boxShadow: "0 2px 8px #0001",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%"
                }}
                onMouseOver={e => event?.applicationLink && (e.currentTarget.style.background = "#fb7185")}
                onMouseOut={e => event?.applicationLink && (e.currentTarget.style.background = "var(--primary-coral, #f87171)")}
                title={event?.applicationLink ? "Apply through external link" : "Organizer did not provide application link"}
                disabled={!event?.applicationLink}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Apply Now
              </button>
            )}
            
            {/* Contact Organizer Button */}
            <button
              onClick={() => router.push("/community")}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "10px 22px",
                fontWeight: 600,
                fontSize: 18,
                cursor: "pointer",
                transition: "background 0.2s",
                width: "100%"
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#e5e7eb")}
              onMouseOut={e => (e.currentTarget.style.background = "#f3f4f6")}
            >
              Contact Organizer
            </button>
          </div>
        </div>
        {/* Name & Description */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 12, color: "var(--primary-coral, #f87171)", textShadow: "0 2px 8px #fff8, 0 1px 0 #fff" }}>{event.name}</h1>
          <p style={{ fontSize: 20, color: "#374151", marginBottom: 18 }}>{event.description}</p>
          {typeof event.score === "number" && !isNaN(event.score) && (
            <div style={{ width: 120, margin: "1rem 0" }}>
              {isClient && (
                <CircularProgressbar
                  value={event.score}
                  text={`${Math.round(event.score)}%`}
                  maxValue={100}
                  styles={buildStyles({
                    textColor: "var(--text-primary)",
                    pathColor: "var(--primary-coral)",
                    trailColor: "#e5e7eb",
                    textSize: "18px",
                  })}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details and Tags Section */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
        {/* Details Card */}
        <div style={{ flex: 1, minWidth: 320, background: "#f9fafb", borderRadius: 14, boxShadow: "0 1px 4px #0001", padding: 28, marginBottom: 0 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18, color: "var(--primary-coral, #f87171)", textShadow: "0 2px 8px #fff8, 0 1px 0 #fff" }}>Event Details</h2>
          <div style={{ marginBottom: 12 }}><span className="info-label">Date</span><br /><span className="info-value">{formatDate(event.startDate)} - {formatDate(event.endDate)}</span></div>
          <div style={{ marginBottom: 12 }}><span className="info-label">Location</span><br /><span className="info-value">{event.location?.city}, {event.location?.state}</span></div>
          <div style={{ marginBottom: 12 }}><span className="info-label">Booth Fees</span><br /><span className="info-value">{renderBoothFees(event.booth_fees)}</span></div>
          <div style={{ marginBottom: 12 }}><span className="info-label">Estimated Headcount</span><br /><span className="info-value">{event.estimated_headcount && event.estimated_headcount !== 0 ? event.estimated_headcount : "Headcount/ Number of Vendors not provided by organizer"}</span></div>
          <div style={{ marginBottom: 12 }}><span className="info-label">Number of Vendors</span><br /><span className="info-value">{event.num_vendors && event.num_vendors !== 0 ? event.num_vendors : "Headcount/ Number of Vendors not provided by organizer"}</span></div>
        </div>
        {/* Tags Card */}
        <div style={{ flex: 1, minWidth: 320, background: "#f9fafb", borderRadius: 14, boxShadow: "0 1px 4px #0001", padding: 28, marginBottom: 0 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 18, color: "var(--primary-coral, #f87171)", textShadow: "0 2px 8px #fff8, 0 1px 0 #fff" }}>Tags & Categories</h2>
          <div style={{ marginBottom: 10 }}><span className="info-label">Category Tags</span><br />{event.category_tags?.map((tag: string) => <Pill key={tag} color="#e0e7ff">{tag}</Pill>)}</div>
          <div style={{ marginBottom: 10 }}><span className="info-label">Type</span><br />{event.type && <Pill color="#fef3c7">{event.type}</Pill>}</div>
          <div style={{ marginBottom: 10 }}><span className="info-label">Demographics</span><br />{event.demographic_guess?.map((demo: string) => <Pill key={demo} color="#fce7f3">{demo}</Pill>)}</div>
          <div style={{ marginBottom: 10 }}><span className="info-label">Vendor Categories</span><br />{event.vendor_categories?.map((cat: string) => <Pill key={cat} color="#d1fae5">{cat}</Pill>)}</div>
        </div>
      </div>

      {/* Why this score section - always show if userScoreBreakdown exists */}
      {userScoreBreakdown && (
        <div style={{ margin: "2rem 0", padding: 32, background: "#fff7f4", borderRadius: 16, boxShadow: "0 1px 4px #f8717111" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--primary-coral, #f87171)", textShadow: "0 2px 8px #fff8, 0 1px 0 #fff", margin: 0 }}>
              Why this score?
            </h2>
            <span style={{ marginLeft: 10, position: "relative", display: "inline-block" }}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#fbbf24", cursor: "pointer" }} title="Scores marked with a star are your priority factors. These are weighted more heavily based on your vendor profile preferences." />
            </span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 18,
            alignItems: "stretch",
          }}>
            {Object.entries(userScoreBreakdown)
              .filter(([key]) => key !== "total" && key !== "pastEventScore" && key !== "vendorsNeededScore" && key !== "descriptionScore")
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .map(([key, value]) => {
                const max = maxPoints[key] || 1;
                const percent = Math.round((Number(value) / max) * 100);
                const isPriority = userPriorityKeys.includes(key);
                return (
                  <div
                    key={key}
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      boxShadow: isPriority ? "0 2px 8px #fbbf2444, 0 1px 4px #f8717111" : "0 1px 4px #f8717111",
                      padding: 14,
                      marginBottom: 8,
                      border: isPriority ? "2px solid #fbbf24" : "1px solid #f3f4f6",
                      minHeight: 120,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      boxSizing: "border-box",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                      <Pill color="#fef3c7">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Pill>
                      {isPriority && (
                        <span style={{ marginLeft: 6, display: "flex", alignItems: "center" }}>
                          <FontAwesomeIcon icon={faStar} style={{ color: "#fbbf24", fontSize: 18 }} title="Your Priority" />
                          <span style={{ marginLeft: 4, color: "#fbbf24", fontWeight: 600, fontSize: 13 }}>Priority</span>
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#f87171", marginBottom: 4 }}>{Math.round(Number(value))} / {max}</div>
                    <div style={{ height: 7, background: "#fde68a", borderRadius: 4, margin: "4px 0" }}>
                      <div style={{ width: `${percent}%`, height: 7, background: "#fbbf24", borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                      {(() => {
                        switch (key) {
                          case "eventTypeScore": return "How well the event type matches your preferences.";
                          case "locationScore": return "How well the location matches your preferred cities.";
                          case "budgetScore": return "How well the booth fees fit your budget.";
                          case "demographicsScore": return "How well the event's audience matches your target demographic.";
                          case "eventSizeScore": return "How well the event size matches your preferred size.";
                          case "scheduleScore": return "How well the event dates match your preferred days.";
                          case "vendorCategoryScore": return "How well your vendor category matches the event.";
                          default: return "";
                        }
                      })()}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
