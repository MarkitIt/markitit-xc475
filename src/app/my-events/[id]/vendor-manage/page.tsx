'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import styles from "../../../page.module.css";
import '../../../tailwind.css';

interface Vendor {
  eventId: string;
  hostId: string;
  vendorId: { email: string; firstName: string; lastName:string; status: string }[]; // Array of objects with email and status
}

export default function ApplicationHostProfile() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string; // Get the id from the URL
  const [vendors, setVendors] = useState<{ email: string; firstName: string; lastName:string; status: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        if (!eventId) {
          console.warn("Event ID is missing.");
          setIsLoading(false);
          return;
        }

        const vendorsQuery = collection(db, 'vendorApply');
        const vendorsSnapshot = await getDocs(vendorsQuery);
        const vendorsList = vendorsSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              eventId: data.eventId,
              hostId: data.hostId,
              vendorId: Array.isArray(data.vendorId)
                ? data.vendorId.map((vendor: any) => ({
                    email: vendor.email || "",
                    firstName: vendor.firstName || "",
                    lastName: vendor.firstName || "",
                    status: vendor.status || "",
                  }))
                : [],
            } as Vendor;
          })
          .filter(vendor => vendor.eventId === eventId); // Filter by eventId

        setVendors(vendorsList.flatMap(vendor => vendor.vendorId));
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    };

    fetchVendors(); // Call the function
  }, [eventId]);

  const handleReject = async (email: string) => {
    console.log(`Rejected vendor with email: ${email}`);

    // Update the vendor's status to "REJECTED" in the state
    setVendors((prevVendors) =>
      prevVendors.map((vendor) =>
        vendor.email === email ? { ...vendor, status: "REJECTED" } : vendor
      )
    );

    // Update the vendor's status in the database
    try {
        const vendorsQuery = collection(db, 'vendorApply');
        const vendorsSnapshot = await getDocs(vendorsQuery);
        const vendorDoc = vendorsSnapshot.docs.find(doc => doc.data().vendorId.some((v: any) => v.email === email));
        if (vendorDoc) {
          const vendorRef = doc(db, 'vendorApply', vendorDoc.id);
          await updateDoc(vendorRef, {
            vendorId: vendorDoc.data().vendorId.map((v: any) =>
              v.email === email ? { ...v, status: "REJECTED" } : v
            ),
          });
        }
      console.log(`Vendor with email ${email} status updated to REJECTED in the database.`);
    } catch (error) {
      console.error(`Error updating vendor status for email ${email}:`, error);
    }
  };

  const handleAccept = async (email: string) => {
    console.log(`Accepted vendor with email: ${email}`);

    // Update the vendor's status to "ACCEPTED" in the state
    setVendors((prevVendors) =>
      prevVendors.map((vendor) =>
        vendor.email === email ? { ...vendor, status: "ACCEPTED" } : vendor
      )
    );

    try {
        const vendorsQuery = collection(db, 'vendorApply');
        const vendorsSnapshot = await getDocs(vendorsQuery);
        const vendorDoc = vendorsSnapshot.docs.find(doc => doc.data().vendorId.some((v: any) => v.email === email));
        if (vendorDoc) {
          const vendorRef = doc(db, 'vendorApply', vendorDoc.id);
          await updateDoc(vendorRef, {
            vendorId: vendorDoc.data().vendorId.map((v: any) =>
              v.email === email ? { ...v, status: "ACCEPTED" } : v
            ),
          });
        }
      console.log(`Vendor with email ${email} status updated to ACCEPTED in the database.`);
    } catch (error) {
      console.error(`Error updating vendor status for email ${email}:`, error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ol>
          <li>Welcome to MarkitIt!.</li>
          <li>From xc475</li>
        </ol>

        {isLoading ? (
          <p>Loading vendors...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">FirstName</th>
                  <th className="border border-gray-300 px-4 py-2">LastName</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{vendor.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.firstName}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.lastName}</td>
                    <td className="border border-gray-300 px-4 py-2">{vendor.status}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                        onClick={() => handleReject(vendor.email)}
                      >
                        REJECT
                      </button>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleAccept(vendor.email)}
                      >
                        ACCEPT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}