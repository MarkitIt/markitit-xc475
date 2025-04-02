'use client';

import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { RoleCard } from './components/RoleCard';
import { useUserContext } from '@/context/UserContext';
import { useState } from 'react';
import { db } from "../../lib/firebase";
import { doc, updateDoc } from 'firebase/firestore';

const ROLES = [
  {
    title: 'Become a Host',
    description: 'Create and manage events, connect with vendors, and grow your community',
    icon: '/icons/host.svg',
    path: '/create-profile/host'
  },
  {
    title: 'Become a Vendor',
    description: 'Find events, showcase your products, and grow your business',
    icon: '/icons/vendor.svg',
    path: '/vendor-profile'
  }
];

export default function CreateProfilePage() {
   
  const router = useRouter();
  const { user } = useUserContext();
  const [role, setRole] = useState("");
  const [error, setError] = useState("");



  const handleSubmit = async (role: string) => {
    try {
      // Ensure the user is logged in
      if (!user) {
        alert("You must be logged in to update your role.");
        return;
      }
  
      // Update the user's role in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        role, // Update the role property (e.g., "host" or "vendor")
      });
  
      alert(`Your role has been updated to ${role} successfully!`);
      if (role=="vendor") router.push("/vendor-profile"); // Redirect to the dashboard or appropriate page
      else router.push('/create-profile/host')
    } catch (error) {
      console.error("Error updating role:", error);
      setError((error as Error).message);
    }
  };


  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
    }} className={styles.container}>
      <h1 style={{
        fontSize: theme.typography.fontSize.title,
        color: theme.colors.text.primary,
      }} className={styles.title}>
        Choose Your Role
      </h1>
      
      <p style={{
        fontSize: theme.typography.fontSize.body,
        color: theme.colors.text.secondary,
      }} className={styles.description}>
        Select whether you want to host events or become a vendor. This will determine your experience on MarkitIt.
      </p>

      <div className={styles.cardsContainer}>
        {ROLES.map(role => (
          <RoleCard
            key={role.title}
            title={role.title}
            description={role.description}
            icon={role.icon}
            onClick={() => router.push(role.path)}
          />
        ))}
      </div>
    </main>
  );
} 