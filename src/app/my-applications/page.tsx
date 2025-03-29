'use client';

import { useEffect, useState } from 'react';
import { theme } from '@/styles/theme';
import { db } from '@/lib/firebase';
import { useUserContext } from '@/context/UserContext';
import { doc, getDoc } from 'firebase/firestore';

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
                status: vendor?.status || 'UNKOWN', // Get the status (e.g., PENDING)
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

  return (
    <main
      style={{
        backgroundColor: theme.colors.background.main,
        minHeight: 'calc(100vh - 80px)',
        padding: theme.spacing.xl,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.xl,
        }}
      >
        <h1
          style={{
            fontSize: theme.typography.fontSize.title,
            color: theme.colors.text.primary,
          }}
        >
          My Applications
        </h1>

        <button
          style={{
            backgroundColor: theme.colors.primary.coral,
            color: theme.colors.background.white,
            padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
            borderRadius: theme.borderRadius.md,
            border: 'none',
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.body,
          }}
        >
          New Application
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.lg,
        }}
      >
        {applications.length > 0 ? (
          applications.map((application: any, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: theme.colors.background.white,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.md,
                }}
              >
                <h2
                  style={{
                    fontSize: theme.typography.fontSize.header,
                    color: theme.colors.text.primary,
                  }}
                >
                  {application.eventName || 'Unnamed Event'}
                </h2>
                <span
                  style={{
                    backgroundColor: theme.colors.background.main,
                    color: theme.colors.text.primary,
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.fontSize.body,
                  }}
                >
                  {application.status || 'UNKNOWN'}
                </span>
              </div>

              <p
                style={{
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.md,
                }}
              >
                Application submitted on{' '}
                {new Date(application.appliedAt).toLocaleDateString() || 'N/A'}
              </p>

              <button
                style={{
                  backgroundColor: 'transparent',
                  color: theme.colors.primary.coral,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.primary.coral}`,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.body,
                }}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </main>
  );
}