'use client';

import { theme } from '@/styles/theme';

export default function NotificationsPage() {
  return (
    <main style={{
      minHeight: 'calc(100vh - 80px)', // Account for header height
      padding: theme.spacing.xl,
    }}>
      <h1 style={{
        fontSize: theme.typography.fontSize.title,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
      }}>
        Notifications
      </h1>
      
      <div style={{
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.body,
          color: theme.colors.text.secondary,
        }}>
          No new notifications
        </p>
      </div>
    </main>
  );
} 