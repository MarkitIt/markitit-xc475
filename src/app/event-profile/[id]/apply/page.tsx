"use client";

import { collection, getDocs ,addDoc,updateDoc,arrayUnion} from "firebase/firestore";
import { doc, getDoc } from 'firebase/firestore';
import { useRouter , useParams} from 'next/navigation';
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { db } from "../../../../lib/firebase";
import '../../../tailwind.css';
import BusinessAdjective from "@/app/vendor-profile/businessAdjective/page";


const EventApplyProfile = () => {
  
  const [loading, setLoading] = useState(true);

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
        phone:vendorProfileData.phone, // Vendor's phone number
        categories: vendorProfileData.selectedCategories, // Vendor's categories
        pastPopup: vendorProfileData.selectedPastPopups, // Vendor's past popup experience
        status: "PENDING", // Default status
      };
  
      await updateDoc(vendorApplyDocRef, {
        vendorId: arrayUnion(vendorData), // Append the new vendor data to the `vendorId` array
      });
  
      console.log("Vendor application submitted successfully:", vendorData);
  
      const appliedAt= new Date().toISOString();
      const eventDocSnap = await getDoc(eventDocRef); // Fetch the event document
      const eventName = eventDocSnap.exists() ? eventDocSnap.data().name : null; // Get the event name from the document
      if (!eventName) {
        alert("Event name not found.");
        return;
      }

      await updateDoc(userDocRef, {
        events: arrayUnion({eventId:eventId,appliedAt:appliedAt,eventName:eventName}),
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


 
  return (
    <div className="min-h-screen bg-white text-black">
      <main className="p-16 flex space-x-16">

        {/* Large Placeholder Image */}
        <div className="w-[50%] h-[450px] bg-gray-300"></div>

        {/* Profile */}
        <div className="w-[50%]">
          {/* <h2 className="text-md text-gray-500">Step 01/05</h2>
          <h1 className="text-5xl font-bold mb-8">Create Business Profile</h1> */}
          {/* All the fillable box form */}
          <div className="text-xl">
            
            {/* <div className="">Business name<span className="text-red-500">*</span></div>
            <input
              className="w-[70%] h-14 bg-gray-300 mb-8 text-left align-top p-2"
            //   value={businessName}
            //   onChange={handleBusinessNameChange}
              required
            /> */}

            
          <div className="">You're sure you want to apply to the event ?<span className="text-red-500"></span></div>
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