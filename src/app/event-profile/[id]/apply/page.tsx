"use client";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { db } from "../../../../lib/firebase";
import "../../../tailwind.css";
import { Event } from "@/types/Event";

interface EventWithCustomQuestions extends Event {
  customQuestions?: Array<{
    title: string;
    description?: string;
    isRequired: boolean;
  }>;
}

const EventApplyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]); // State to store custom questions
  const [answers, setAnswers] = useState<{
    [key: number]: { question: string; value: string };
  }>({}); // State to store answers
  const router = useRouter();
  const params = useParams();
  const idParam = params.id as string; // Get the id from the URL
  const [eventId, setEventId] = useState<string | null>(null); // Actual Firebase document ID
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useUserContext(); // Get the logged-in user from the context
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        console.log(
          "Attempting to fetch event with ID for application:",
          idParam,
        );

        // Check if the ID is numeric
        if (/^\d+$/.test(idParam)) {
          const numericId = parseInt(idParam);

          // Fetch all events
          const eventsRef = collection(db, "events");
          const querySnapshot = await getDocs(eventsRef);
          const allEvents = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as EventWithCustomQuestions[];

          console.log(`Found ${allEvents.length} events in total`);

          // Get the event at the specified index (adjust for zero-based array)
          const eventIndex = numericId - 1;
          if (eventIndex >= 0 && eventIndex < allEvents.length) {
            const selectedEvent = allEvents[eventIndex];
            console.log("Found event by index for application:", selectedEvent);
            setEventId(selectedEvent.id);
            setCustomQuestions(selectedEvent.customQuestions || []);
          } else {
            console.log(
              `Event index out of range: ${eventIndex}, total events: ${allEvents.length}`,
            );
            setErrorMessage(`Event #${numericId} not found`);
          }
        } else {
          // Use the ID directly
          setEventId(idParam);
          const eventDocRef = doc(db, "events", idParam);
          const eventDocSnap = await getDoc(eventDocRef);

          if (eventDocSnap.exists()) {
            const eventData = eventDocSnap.data();
            setCustomQuestions(eventData.customQuestions || []);
          } else {
            console.error("Event not found.");
            setErrorMessage("Event not found");
          }
        }
      } catch (err) {
        console.error("Error fetching event for application:", err);
        setErrorMessage("Error loading event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [idParam]);

  const handleNextStepClick = async () => {
    try {
      setLoading(true);

      if (!eventId) {
        alert("Event not found.");
        return;
      }

      if (!user) {
        alert("You must be logged in to apply.");
        return;
      }
      

      console.log("Current user ID:", user.uid);
      setDebugInfo(`Checking for vendor profile with ID: ${user.uid}`);

      // Fetch the user's data from the Firestore `users` collection
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);


      if (!userDocSnap.exists()) {
        setDebugInfo(`User document not found for ID: ${user.uid}`);
        alert("User data not found.");
        return;
      }

      const userData = userDocSnap.data();
      setDebugInfo(`User found: ${userData.email || "No email"}`);

      // Fetch the vendor's profile from the `vendorProfile` collection
      // Instead of looking for a document with ID matching user.uid,
      // query for documents where the uid field equals user.uid
      setDebugInfo(
        `Looking for vendor profile with uid field matching: ${user.uid}`,
      );

      const vendorProfileQuery = query(
        collection(db, "vendorProfile"),
        where("uid", "==", user.uid),
      );

      const vendorProfileSnapshot = await getDocs(vendorProfileQuery);

      if (vendorProfileSnapshot.empty) {
        setDebugInfo(
          `No vendor profile found with uid: ${user.uid}. Creating a vendor profile is required.`,
        );
        alert(
          "Vendor profile not found. Please create a vendor profile first.",
        );

        // Add a button to create vendor profile instead of automatic redirect
        if (confirm("Would you like to create a vendor profile now?")) {
          router.push("/vendor-profile");
        }
        return;
      }

      // Use the first matching document
      const vendorProfileDoc = vendorProfileSnapshot.docs[0];
      const vendorProfileData = vendorProfileDoc.data();
      setDebugInfo(
        `Found vendor profile with document ID: ${vendorProfileDoc.id} for user: ${user.uid}`,
      );

      // Reference the existing document in the `vendorApply` collection
      const vendorApplyDocRef = doc(db, "vendorApply", eventId); // Now using the real event ID
      const eventDocRef = doc(db, "events", eventId); // Reference to the event document
      // Check if the document exists
      const vendorApplyDocSnap = await getDoc(vendorApplyDocRef);

      if (!vendorApplyDocSnap.exists()) {
        alert("Event not found in vendorApply collection.");
        return;
      }

      const vendorApplyData = vendorApplyDocSnap.data();

      // Check if the user is already in the vendorId array
      const isAlreadyApplied = vendorApplyData.vendorId?.some(
        (v: any) => v.email === userData.email,
      );

      if (isAlreadyApplied) {
        alert("You have already applied to this event.");
        return;
      }

      for (const [index, question] of customQuestions.entries()) {
        if (question.isRequired && !answers[index]) {
          alert(`Please answer the required question: "${question.title}"`);
          setLoading(false);
          return;
        }
      }

      // Update the existing document by appending the new vendor data
      const vendorData = {
        email: userData.email || "N/A", // Default to "N/A" if undefined
        firstName: userData.firstName || "N/A",
        lastName: userData.lastName || "N/A",
        businessName: vendorProfileData.businessName || "N/A",
        description: vendorProfileData.description || "N/A",
        streetAddress: vendorProfileData.streetAddress || "N/A",
        city: vendorProfileData.city || "N/A",
        stateProvince: vendorProfileData.stateProvince || "N/A",
        zipPostalCode: vendorProfileData.zipPostalCode || "N/A",
        country: vendorProfileData.country || "N/A",
        phone: vendorProfileData.phone || "N/A",
        categories: vendorProfileData.selectedCategories || [],
        pastPopup: vendorProfileData.selectedPastPopups || [],
        answers: answers || {},
        status: "PENDING",
      };

      if (Object.values(vendorData).some((value) => value === undefined)) {
        console.error("Invalid vendorData:", vendorData);
        alert("Some required fields are missing. Please try again.");
        setLoading(false);
        return;
      }      

      await updateDoc(vendorApplyDocRef, {
        vendorId: arrayUnion(vendorData), // Append the new vendor data to the `vendorId` array
      });

      console.log("Vendor application submitted successfully:", vendorData);

      const appliedAt = new Date().toISOString();
      const eventDocSnap = await getDoc(eventDocRef); // Fetch the event document
      const eventName = eventDocSnap.exists() ? eventDocSnap.data().name : null; // Get the event name from the document
      if (!eventName) {
        alert("Event name not found.");
        return;
      }

      if (!eventId || !appliedAt || !eventName) {
        console.error("Invalid data for arrayUnion:", { eventId, appliedAt, eventName });
        alert("Some required fields are missing. Please try again.");
        return;
      }

      await updateDoc(userDocRef, {
        events: arrayUnion({
          eventId: eventId,
          appliedAt: appliedAt,
          eventName: eventName,
        }),
      });

      console.log("Vendor application submitted successfully:", eventId);

      // Redirect to the home page or a success page
      router.push("/");
    } catch (error: any) {
      console.error("Error submitting vendor application:", error);
      setDebugInfo(`Error: ${error.toString()}`);
      alert(
        "An error occurred while submitting your application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (
    index: number,
    question: string,
    value: string,
  ) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: { question, value }, // Store the question title along with the answer
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-600">{errorMessage}</div>
        <div className="text-sm text-gray-500">Please try again later</div>
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-gray-600">Event not found</div>
        <div className="text-sm text-gray-500">
          Please go back and try another event
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex flex-col md:flex-row md:space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-full md:w-[50%] h-[250px] md:h-[450px] bg-gray-300 mb-8 md:mb-0"></div>

        {/* Profile */}
        <div className="w-full md:w-[50%]">
          <div className="text-xl">
            <div className="">
              You're sure you want to apply to the event?
              <span className="text-red-500"></span>
            </div>

            {/* Display Debug Info */}
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm font-mono">
                <p className="text-gray-700">Debug info:</p>
                <p className="text-gray-900">{debugInfo}</p>
              </div>
            )}

            {/* Display Custom Questions */}
            {customQuestions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Custom Questions</h2>
                {customQuestions.map((question, index) => (
                  <div key={index} className="mb-6">
                    <p className="font-semibold">{question.title}</p>
                    {question.description && (
                      <p className="text-gray-600">{question.description}</p>
                    )}
                    {question.isRequired && (
                      <span className="text-red-500">* Required</span>
                    )}
                    <input
                      type="text"
                      placeholder="Your answer"
                      value={answers[index]?.value || ""}
                      onChange={(e) =>
                        handleAnswerChange(
                          index,
                          question.title,
                          e.target.value,
                        )
                      }
                      className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2 bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Next step click */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
              <div
                className="w-full sm:w-36 h-14 bg-gray-300 flex items-center justify-center rounded-lg cursor-pointer"
                onClick={() => router.push(`/event-profile/${idParam}`)}
              >
                Back
              </div>
              <div
                className="w-full sm:w-48 h-14 bg-black text-white rounded-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
                onClick={handleNextStepClick}
              >
                Apply
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventApplyProfile;
