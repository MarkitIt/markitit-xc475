'use client';

import {ApplicationCard} from './components/ApplicationCard';
import { useEffect, useState } from 'react';
import { theme } from '@/styles/theme';
import { db } from '@/lib/firebase';
import { useUserContext } from '@/context/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import styles from './styles.module.css';

export default function MyApplicationsPage() {
  const { user } = useUserContext(); // Get the logged-in user
  const [applications, setApplications] = useState<any[]>([]); // State to store applications
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
  
      try {
        const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const events = userData.events || []; // Fetch the `events` field (array or map)
  
          // Extract event IDs and event names from the array of objects
          const applicationsWithStatus = await Promise.all(
            events.map(async (event: any) => {
              const { eventId, eventName } = event; // Extract eventId and eventName from the event object

              const vendorApplyDocRef = doc(db, 'vendorApply', eventId); // Reference to the vendorApply document
              const vendorApplyDocSnap = await getDoc(vendorApplyDocRef);

              if (vendorApplyDocSnap.exists()) {
                const vendorApplyData = vendorApplyDocSnap.data();
                const vendor = vendorApplyData.vendorId?.find(
                  (v: any) => v.email === user.email // Match the user's email
              );

              return {
                eventId,
                eventName: eventName || vendorApplyData.eventName || 'Unnamed Event', // Use eventName from the user's document or fallback to vendorApply
                status: vendor?.status || 'UNKNOWN', // Get the status (e.g., PENDING)
                appliedAt: event.appliedAt || 'N/A', // Use appliedAt from the user's document
              };
              } else {
                return {
                  eventId,
                  eventName: eventName || 'Event Not Found',
                  status: 'UNKNOWN',
                  appliedAt: event.appliedAt || 'N/A',
                };
              }
            })
          );
  
          setApplications(applicationsWithStatus); // Update state with the applications
        } else {
          console.error('User document not found.');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
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
  };

  const handleNewApplication = () => {
    // Implement new application functionality
    console.log('Create new application');
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          My Applications
        </h1>

        <button 
          onClick={handleNewApplication}
        >
          New Application
        </button>
      </div>

      <div className={styles.applicationsList}>
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            eventName={application.eventName}
            status={application.status}
            submissionDate={application.submissionDate}
            onViewDetails={() => handleViewDetails(application.id)}
          />
        ))}
      </div>
    </main>
  );
}