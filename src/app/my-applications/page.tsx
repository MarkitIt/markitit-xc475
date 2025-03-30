'use client';

import { useState } from 'react';
import { theme } from '@/styles/theme';
import styles from './styles.module.css';
import { ApplicationCard } from './components/ApplicationCard';

interface Application {
  id: string;
  eventName: string;
  status: string;
  submissionDate: string;
}

export default function MyApplicationsPage() {
  //placeholder data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      eventName: 'Summer Night Market 2024',
      status: 'Pending',
      submissionDate: 'March 26, 2024',
    },
    // Add more applications as needed
  ]);

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
          className={styles.newButton}
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