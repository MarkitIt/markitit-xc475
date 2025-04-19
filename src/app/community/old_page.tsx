'use client';

import { theme } from '@/styles/theme';

export default function CommunityPage() {
  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
      minHeight: 'calc(100vh - 80px)',
      padding: theme.spacing.xl,
    }}>
      <h1 style={{
        fontSize: theme.typography.fontSize.title,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
      }}>
        Vendor Community
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing.xl,
      }}>
        {/* Example Community Cards */}
        <div style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}>
            Upcoming Events
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
          }}>
            Connect with other vendors and discover upcoming events in your area.
          </p>
        </div>

        <div style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}>
            Discussion Forum
          </h2>
          <p style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
          }}>
            Share experiences and get advice from other vendors.
          </p>
        </div>
      </div>
    </main>
  );
} 