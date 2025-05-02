'use client';

import { useUserContext } from '@/context/UserContext';
import TopOpportunities from './components/TopOpportunities';
import ExploreNetwork from './components/ExploreNetwork';
import MarkitItUpdates from './components/MarkitItUpdates';
import GuidesAndResources from './components/GuidesAndResources';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { user, vendorProfile } = useUserContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user || !vendorProfile) {
    return (
      <div className={styles.loading}>
        Please sign in to view your dashboard
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>
          Welcome back, {vendorProfile.businessName}!
        </h1>
        <p className={styles.welcomeSubtitle}>
          Here's what's happening in your pop-up world
        </p>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.updatesArea}>
          <MarkitItUpdates />
        </div>
        <div className={styles.opportunitiesArea}>
          <TopOpportunities />
        </div>
        <div className={styles.networkArea}>
          <ExploreNetwork />
        </div>
        <div className={styles.guidesArea}>
          <GuidesAndResources />
        </div>
      </div>
    </div>
  );
} 