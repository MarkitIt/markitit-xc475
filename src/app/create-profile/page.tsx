'use client';

import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { RoleCard } from './components/RoleCard';

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