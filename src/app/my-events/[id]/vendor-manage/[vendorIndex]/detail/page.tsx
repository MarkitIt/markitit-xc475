"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the import path to your Firebase configuration

const VendorDetailPage = () => {
  const params = useParams(); // Get the dynamic route parameters
  const { id: eventId, vendorIndex } = params; // Extract event ID and vendorIndex from the parameters
  const [vendor, setVendor] = useState<any>(null); // State to store vendor information
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        if (!eventId) {
          console.error("Event ID is missing.");
          return;
        }

        // Fetch the vendorApply document for the event
        if (typeof eventId !== "string") {
          console.error("Invalid event ID.");
          return;
        }
        const vendorApplyDocRef = doc(db, "vendorApply", eventId);
        const vendorApplyDocSnap = await getDoc(vendorApplyDocRef);

        if (vendorApplyDocSnap.exists()) {
          const vendorData = vendorApplyDocSnap.data();
          const vendors = vendorData.vendorId || []; // Get the vendorId array
          const index = vendorIndex
            ? parseInt(
                Array.isArray(vendorIndex) ? vendorIndex[0] : vendorIndex,
                10,
              ) - 1
            : -1; // Safely parse vendorIndex
          const vendorInfo = index >= 0 ? vendors[index] : null; // Get the vendor by index
          setVendor(vendorInfo);
        } else {
          console.error("VendorApply document not found.");
        }
      } catch (error) {
        console.error("Error fetching vendor information:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, [eventId, vendorIndex]);

  if (isLoading) {
    return <p>Loading vendor details...</p>;
  }

  if (!vendor) {
    return <p>Vendor not found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-4">Vendor Details</h1>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Email:</span> {vendor.email}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">First Name:</span> {vendor.firstName}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Last Name:</span> {vendor.lastName}
      </p>
      <p className="text-lg text-gray-700">
        <span className="font-semibold">Status:</span> {vendor.status}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        More information will be added here soon.
      </p>
    </div>
  );
};

export default VendorDetailPage;
