"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { db } from "../../../lib/firebase";
import "../../tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
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
  const { user } = useUserContext();
  const [isClient, setIsClient] = useState(false);

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

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return null;

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: 0 }}>
      {/* Top section: Image + Name/Description */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start", marginBottom: 32 }}>
        {/* Event Image */}
        <div style={{ flex: "0 0 340px", minWidth: 280, maxWidth: 400, height: 260, borderRadius: 18, overflow: "hidden", background: "#f3f4f6", boxShadow: "0 2px 8px #0001", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {event.image ? (
            <Image src={event.image} alt={event.name} width={400} height={260} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          ) : (
            <span style={{ color: "#9ca3af", fontSize: 18 }}>No Image</span>
          )}
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

      {/* Score Breakdown Section */}
      {event.scoreBreakdown && (
        <div style={{ margin: "2rem 0", padding: 32, background: "#f3f4f6", borderRadius: 16, boxShadow: "0 1px 4px #0001" }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Score Breakdown</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
            {Object.entries(event.scoreBreakdown)
              .filter(([key]) => key !== "total")
              .map(([key, value]) => (
                <div key={key} style={{ minWidth: 180, marginBottom: 8 }}>
                  <Pill color="#e0e7ff">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Pill>
                  <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, margin: "6px 0" }}>
                    <div style={{ width: `${Math.round(Number(value))}%`, height: 8, background: "#60a5fa", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#374151" }}>{Math.round(Number(value))}</span>
                </div>
              ))}
          </div>
          {renderScoreBreakdownChart()}
        </div>
      )}
    </div>
  );
}
