'use client';

import { theme } from '@/styles/theme';

export default function MyApplicationsPage() {
  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
      minHeight: 'calc(100vh - 80px)',
      padding: theme.spacing.xl,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
      }}>
        <h1 style={{
          fontSize: theme.typography.fontSize.title,
          color: theme.colors.text.primary,
        }}>
          My Applications
        </h1>
        
        <button style={{
          backgroundColor: theme.colors.primary.coral,
          color: theme.colors.background.white,
          padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
          borderRadius: theme.borderRadius.md,
          border: 'none',
          cursor: 'pointer',
          fontSize: theme.typography.fontSize.body,
        }}>
          New Application
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.lg,
      }}>
        {/* Example Application Card */}
        <div style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}>
            <h2 style={{
              fontSize: theme.typography.fontSize.header,
              color: theme.colors.text.primary,
            }}>
              Summer Night Market 2024
            </h2>
            <span style={{
              backgroundColor: theme.colors.background.main,
              color: theme.colors.text.primary,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.typography.fontSize.body,
            }}>
              Pending
            </span>
          </div>
          
          <p style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.md,
          }}>
            Application submitted on March 26, 2024
          </p>
          
          <button style={{
            backgroundColor: 'transparent',
            color: theme.colors.primary.coral,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.primary.coral}`,
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.body,
          }}>
            View Details
          </button>
        </div>
      </div>
    </main>
  );
} 