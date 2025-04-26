"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "../../../lib/firebase";
import "../../tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "@/context/UserContext";
import { Event } from "@/types/Event";
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

export default function EventProfilePage() {
  const router = useRouter();
  const params = useParams();
  let idParam = "";
  try {
    idParam = decodeURIComponent(params.id as string);
  } catch (err) {
    console.error("Error decoding params.id:", err);
  }
  const [event, setEvent] = useState<Event | null>(null);
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
        
        // First, try to fetch by document ID (for backward compatibility)
        const docRef = doc(db, "events", idParam);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({ ...docSnap.data(), id: docSnap.id } as Event);
        } else {
          // If not found by document ID, try to fetch by the 'id' field
          const q = query(collection(db, "events"), where("id", "==", idParam));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Use the first matching document if found
            const docData = querySnapshot.docs[0].data();
            setEvent({ ...docData, id: querySnapshot.docs[0].id } as Event);
          } else {
            // Also try searching by name if the id field search fails
            const nameQuery = query(collection(db, "events"), where("name", "==", idParam));
            const nameQuerySnapshot = await getDocs(nameQuery);
            
            if (!nameQuerySnapshot.empty) {
              const docData = nameQuerySnapshot.docs[0].data();
              setEvent({ ...docData, id: nameQuerySnapshot.docs[0].id } as Event);
            } else {
              setError("Event not found");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Error loading event");
      } finally {
        setLoading(false);
      }
    };

    if (idParam) {
      fetchEvent();
    }
  }, [idParam]);

  const formatDate = (date: { seconds: number; nanoseconds: number } | undefined) => {
    if (!date) return "";
    const eventDate = new Date(date.seconds * 1000);
    if (eventDate.getFullYear() === 1970 || !date.seconds) {
      eventDate.setFullYear(new Date().getFullYear());
    }
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
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

  if (loading) return <div className="min-h-screen flex justify-center items-center text-xl">Loading...</div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-xl text-red-500">{error}</div>;
  if (!event) return null;

  return (
    <div className="event-profile-container p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div className="w-2/3">
          <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <p className="text-sm text-gray-500">{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
          <p className="text-sm text-gray-500">{event.location?.city}, {event.location?.state}</p>
        </div>
        <div className="w-1/4">
          {isClient && typeof event.score === "number" && !isNaN(event.score) && (
            <CircularProgressbar
              value={event.score}
              text={`${Math.round(event.score)}%`}
              maxValue={100}
              styles={buildStyles({
                textColor: "#000",
                pathColor: "#34d399",
                trailColor: "#e5e7eb",
                textSize: "18px",
              })}
            />
          )}
        </div>
      </div>

      <div className="mt-10">
        {isClient && renderScoreBreakdownChart()}
      </div>
    </div>
  );
}
