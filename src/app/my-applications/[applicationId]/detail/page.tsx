"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the import path to your Firebase configuration

const ApplicationDetailPage = () => {
  const { applicationId } = useParams(); // Extract applicationId from the parameters
  const [event, setEvent] = useState<any>(null); // State to store event details
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!applicationId) {
          console.error("Application ID is missing.");
          return;
        }

        // Fetch the event document from Firestore
        const eventDocRef = doc(db, "events", applicationId as string);
        const eventDocSnap = await getDoc(eventDocRef);

        if (eventDocSnap.exists()) {
          setEvent(eventDocSnap.data()); // Set the event data
        } else {
          console.error("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchEventDetails();
  }, [applicationId]);

  if (isLoading) {
    return <p>Loading event details...</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-4">Event Details</h1>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Event Name:</span> {event.name}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Location:</span> {event.location?.city}, {event.location?.state}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Start Date:</span> {new Date(event.startDate?.seconds * 1000).toLocaleDateString()}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">End Date:</span> {new Date(event.endDate?.seconds * 1000).toLocaleDateString()}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Description:</span> {event.description}
      </p>
      <p className="text-sm text-gray-500 mt-2">More information will be added here soon.</p>
    </div>
  );
};

export default ApplicationDetailPage;