'use client';

import { theme } from '@/styles/theme';

export default function SettingsPage() {
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
        Settings
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gap: theme.spacing.xl,
      }}>
        {/* Settings Navigation */}
        <div style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          height: 'fit-content',
        }}>
          <button style={{
            width: '100%',
            padding: theme.spacing.md,
            textAlign: 'left',
            backgroundColor: theme.colors.background.main,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.body,
            marginBottom: theme.spacing.sm,
            cursor: 'pointer',
          }}>
            Profile Settings
          </button>
          <button style={{
            width: '100%',
            padding: theme.spacing.md,
            textAlign: 'left',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.body,
            marginBottom: theme.spacing.sm,
            cursor: 'pointer',
          }}>
            Account Settings
          </button>
          <button style={{
            width: '100%',
            padding: theme.spacing.md,
            textAlign: 'left',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.body,
            cursor: 'pointer',
          }}>
            Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xl,
          }}>
            Profile Settings
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg,
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.body,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                Display Name
              </label>
              <input
                type="text"
                placeholder="Your display name"
                style={{
                  width: '100%',
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.colors.text.secondary}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.body,
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.body,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  width: '100%',
                  padding: theme.spacing.md,
                  border: `1px solid ${theme.colors.text.secondary}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.body,
                }}
              />
            </div>

            <button style={{
              backgroundColor: theme.colors.primary.coral,
              color: theme.colors.background.white,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              border: 'none',
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.body,
              width: 'fit-content',
            }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 