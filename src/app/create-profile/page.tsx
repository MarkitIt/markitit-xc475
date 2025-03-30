'use client';

import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';

export default function CreateProfilePage() {
  const router = useRouter();

  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
      minHeight: 'calc(100vh - 80px)',
      padding: theme.spacing.xl,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h1 style={{
        fontSize: theme.typography.fontSize.title,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
      }}>
        Choose Your Role
      </h1>
      
      <p style={{
        fontSize: theme.typography.fontSize.body,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xxl,
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        Select whether you want to host events or become a vendor. This will determine your experience on MarkitIt.
      </p>

      <div style={{
        display: 'flex',
        gap: theme.spacing.xxl,
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1000px',
      }}>
        <button
          onClick={() => router.push('/create-profile/host')}
          className={styles.roleButton}
          style={{
            flex: 1,
            maxWidth: '400px',
            aspectRatio: '1',
            backgroundColor: theme.colors.background.white,
            border: `2px solid ${theme.colors.primary.coral}`,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.lg,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Image
            src="/icons/host.svg"
            alt="Host Icon"
            width={80}
            height={80}
          />
          <h2 style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
          }}>
            Become a Host
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }}>
            Create and manage events, connect with vendors, and grow your community
          </p>
        </button>

        <button
          onClick={() => router.push('/vendor-profile')}
          className={styles.roleButton}
          style={{
            flex: 1,
            maxWidth: '400px',
            aspectRatio: '1',
            backgroundColor: theme.colors.background.white,
            border: `2px solid ${theme.colors.primary.coral}`,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.lg,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Image
            src="/icons/vendor.svg"
            alt="Vendor Icon"
            width={80}
            height={80}
          />
          <h2 style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.sm,
          }}>
            Become a Vendor
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
            textAlign: 'center',
          }}>
            Find events, showcase your products, and grow your business
          </p>
        </button>
      </div>
    </main>
  );
} 