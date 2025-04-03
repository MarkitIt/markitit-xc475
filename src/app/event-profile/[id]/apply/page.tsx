"use client";

import { collection, getDocs, addDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { db } from "../../../../lib/firebase";
import "../../../tailwind.css";

const EventApplyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]); // State to store custom questions
  const [answers, setAnswers] = useState<{ [key: number]: { question: string; value: string } }>({}); // State to store answers
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string; // Get the id from the URL
  const { user } = useUserContext(); // Get the logged-in user from the context

  const handleNextStepClick = async () => {
    try {
      setLoading(true);

      if (!user) {
        alert("You must be logged in to apply.");
        return;
      }

      // Fetch the user's data from the Firestore `users` collection
      const userDocRef = doc(db, "users", user.uid); // Assuming `uid` is the document ID
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert("User data not found.");
        return;
      }

      const userData = userDocSnap.data();

      // Fetch the vendor's profile from the `vendorProfile` collection
      const vendorProfileDocRef = doc(db, "vendorProfile", user.uid);
      const vendorProfileDocSnap = await getDoc(vendorProfileDocRef);

      if (!vendorProfileDocSnap.exists()) {
        alert("Vendor profile not found.");
        return;
      }

      const vendorProfileData = vendorProfileDocSnap.data();

      // Reference the existing document in the `vendorApply` collection
      const vendorApplyDocRef = doc(db, "vendorApply", eventId); // Assuming `eventId` is the document ID
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
        (v: any) => v.email === userData.email
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
        email: userData.email, // User's email
        firstName: userData.firstName, // User's first name
        lastName: userData.lastName, // User's last name
        businessName: vendorProfileData.businessName, // Vendor's business name
        description: vendorProfileData.description, // Vendor's description
        streetAddress: vendorProfileData.streetAddress, // Vendor's street address
        city: vendorProfileData.city, // Vendor's city
        stateProvince: vendorProfileData.stateProvince, // Vendor's state
        zipPostalCode: vendorProfileData.zipPostalCode, // Vendor's zip code
        country: vendorProfileData.country, // Vendor's country
        phone: vendorProfileData.phone, // Vendor's phone number
        categories: vendorProfileData.selectedCategories, // Vendor's categories
        pastPopup: vendorProfileData.selectedPastPopups, // Vendor's past popup experience
        answers, // User's answers to the custom questions
        status: "PENDING", // Default status
      };

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

      await updateDoc(userDocRef, {
        events: arrayUnion({ eventId: eventId, appliedAt: appliedAt, eventName: eventName }),
      });

      console.log("Vendor application submitted successfully:", eventId);

      // Redirect to the home page or a success page
      router.push("/");
    } catch (error) {
      console.error("Error submitting vendor application:", error);
      alert("An error occurred while submitting your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEventCustomQuestions = async () => {
      try {
        const eventDocRef = doc(db, "events", eventId);
        const eventDocSnap = await getDoc(eventDocRef);

        if (eventDocSnap.exists()) {
          const eventData = eventDocSnap.data();
          setCustomQuestions(eventData.customQuestions || []); // Set custom questions or default to an empty array
        } else {
          console.error("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event custom questions:", error);
      }
    };

    fetchEventCustomQuestions();
  }, [eventId]);

  const handleAnswerChange = (index: number, question:string,value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: { question, value }, // Store the question title along with the answer
    }));
  };


  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">
        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Profile */}
        <div className="w-[50%]">
          <div className="text-xl">
            <div className="">You're sure you want to apply to the event?<span className="text-red-500"></span></div>

            {/* Display Custom Questions */}
            {customQuestions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Custom Questions</h2>
                {customQuestions.map((question, index) => (
                  <div key={index} className="mb-6">
                    <p className="font-semibold">{question.title}</p>
                    {question.description && <p className="text-gray-600">{question.description}</p>}
                    {question.isRequired && <span className="text-red-500">* Required</span>}
                    <input
                      type="text"
                      placeholder="Your answer"
                      value={answers[index]?.value || ""}
                      onChange={(e) => handleAnswerChange(index,question.title, e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-lg mt-2"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Next step click */}
            <div className="flex space-x-6 mt-8">
              <div className="w-36 h-14 bg-gray-300 flex items-center justify-center">Help</div>
              <div
                className="w-48 h-14 bg-gray-300 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer flex items-center justify-center"
                onClick={handleNextStepClick}
              >
                Yes
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventApplyProfile;