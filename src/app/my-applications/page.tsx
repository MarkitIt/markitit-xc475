'use client';

import {ApplicationCard} from './components/ApplicationCard';
import { useEffect, useState } from 'react';
import  '@/styles/theme';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { useUserContext } from '@/context/UserContext';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import styles from './styles.module.css';

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user } = useUserContext(); // Get the logged-in user
  const [applications, setApplications] = useState<any[]>([]); // State to store applications
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Add debug logging
  useEffect(() => {
    console.log("AUTH DEBUG - Current user state:", user);
    console.log("AUTH DEBUG - User UID:", user?.uid);
    console.log("AUTH DEBUG - User email:", user?.email);
    
    setDebugInfo({
      userExists: !!user,
      uid: user?.uid || 'NULL',
      email: user?.email || 'NULL',
      authProvider: user?.providerId || 'UNKNOWN'
    });

    // Check if Firestore is accessible
    const checkFirestore = async () => {
      try {
        // Try to get a test collection
        const testCollection = collection(db, 'users');
        const snapshot = await getDocs(testCollection);
        console.log("FIRESTORE DEBUG - Database connection successful, found users:", snapshot.size);
      } catch (error) {
        console.error("FIRESTORE DEBUG - Error connecting to Firestore:", error);
      }
    };
    
    checkFirestore();
  }, [user]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        console.log("FETCH DEBUG - No authenticated user, skipping fetch");
        setLoading(false);
        return;
      }
  
      try {
        console.log("FETCH DEBUG - Attempting to fetch applications for UID:", user.uid);
        const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          console.log("FETCH DEBUG - User document found:", userDocSnap.data());
          const userData = userDocSnap.data();
          const events = userData.events || []; // Fetch the `events` field (array or map)
          
          console.log("FETCH DEBUG - Events from user document:", events);
  
          // Extract event IDs and event names from the array of objects
          const applicationsWithStatus = await Promise.all(
            events.map(async (event: any) => {
              const { eventId, eventName } = event; // Extract eventId and eventName from the event object
              console.log("FETCH DEBUG - Processing event:", { eventId, eventName });

              const vendorApplyDocRef = doc(db, 'vendorApply', eventId); // Reference to the vendorApply document
              const vendorApplyDocSnap = await getDoc(vendorApplyDocRef);

              if (vendorApplyDocSnap.exists()) {
                const vendorApplyData = vendorApplyDocSnap.data();
                console.log("FETCH DEBUG - Found vendorApply document:", vendorApplyData);
                
                const vendor = vendorApplyData.vendorId?.find(
                  (v: any) => v.email === user.email // Match the user's email
                );
                
                console.log("FETCH DEBUG - Matched vendor:", vendor);

                return {
                  eventId,
                  eventName: eventName || vendorApplyData.eventName || 'Unnamed Event', // Use eventName from the user's document or fallback to vendorApply
                  status: vendor?.status || 'UNKNOWN', // Get the status (e.g., PENDING)
                  appliedAt: event.appliedAt || 'N/A', // Use appliedAt from the user's document
                };
              } else {
                console.log("FETCH DEBUG - VendorApply document not found for event:", eventId);
                return {
                  eventId,
                  eventName: eventName || 'Event Not Found',
                  status: 'UNKNOWN',
                  appliedAt: event.appliedAt || 'N/A',
                };
              }
            })
          );
  
          console.log("FETCH DEBUG - Final applications with status:", applicationsWithStatus);
          setApplications(applicationsWithStatus); // Update state with the applications
        } else {
          console.error('FETCH DEBUG - User document not found for UID:', user.uid);
          
          // Try to find the user by email as a fallback
          if (user.email) {
            console.log("FETCH DEBUG - Attempting to find user by email:", user.email);
            // This could be expanded to actually search by email if needed
          }
        }
      } catch (error) {
        console.error('FETCH DEBUG - Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApplications();
  }, [user]);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  const handleViewDetails = (applicationId: string) => {
    // Implement view details functionality
    console.log('View details for application:', applicationId);
    router.push(`/my-applications/${applicationId}/detail`); // Navigate to the application details page
  };

  const handleNewApplication = () => {
    // Implement new application functionality
    console.log('Create new application');
    router.push('/search-events'); // Navigate to the search events page
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          My Applications
        </h1>

        <button 
          onClick={handleNewApplication}
          className={styles.newButton}
        >
          Find Events
        </button>
      </div>

      {/* Add debug information panel */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#f5f5f5'
      }}>
        <h3>Debug Information</h3>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        <p>Applications found: {applications.length}</p>
      </div>

      {applications.length > 0 ? (
        <div className={styles.applicationsList}>
          {applications.map((application) => (
            <ApplicationCard
              key={application.eventId} // Use a unique key
              eventName={application.eventName}
              status={application.status}
              submissionDate={application.appliedAt || 'N/A'}
              onViewDetails={() => handleViewDetails(application.eventId)} // Pass the eventId to the view details function
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>You haven't applied to any events yet.</p>
          <p>Browse available events and submit your first application!</p>
        </div>
      )}
    </main>
  );
}
