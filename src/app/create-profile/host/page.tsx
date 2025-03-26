'use client';

import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';

export default function HostProfilePage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    // After successful submission, redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
      minHeight: 'calc(100vh - 80px)',
      padding: theme.spacing.xl,
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h1 style={{
          fontSize: theme.typography.fontSize.title,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.xl,
        }}>
          Create Host Profile
        </h1>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xl,
        }}>
          <div>
            <h2 style={{
              fontSize: theme.typography.fontSize.header,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
            }}>
              Basic Information
            </h2>
            
            <div style={{
              display: 'grid',
              gap: theme.spacing.lg,
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.sm,
                }}>
                  Organization Name*
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your organization name"
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
                  Organization Description*
                </label>
                <textarea
                  required
                  placeholder="Tell us about your organization"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.text.secondary}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 style={{
              fontSize: theme.typography.fontSize.header,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
            }}>
              Contact Information
            </h2>
            
            <div style={{
              display: 'grid',
              gap: theme.spacing.lg,
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.sm,
                }}>
                  Contact Email*
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your contact email"
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
                  Phone Number*
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your phone number"
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
                  Website (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Enter your website URL"
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.text.secondary}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 style={{
              fontSize: theme.typography.fontSize.header,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
            }}>
              Event Preferences
            </h2>
            
            <div style={{
              display: 'grid',
              gap: theme.spacing.lg,
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.sm,
                }}>
                  Event Types*
                </label>
                <select
                  required
                  multiple
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.text.secondary}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                  }}
                >
                  <option value="market">Markets</option>
                  <option value="fair">Fairs</option>
                  <option value="festival">Festivals</option>
                  <option value="popup">Pop-up Events</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.sm,
                }}>
                  Typical Event Capacity*
                </label>
                <select
                  required
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.text.secondary}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                  }}
                >
                  <option value="">Select capacity range</option>
                  <option value="small">Small (1-20 vendors)</option>
                  <option value="medium">Medium (21-50 vendors)</option>
                  <option value="large">Large (51-100 vendors)</option>
                  <option value="xlarge">Extra Large (100+ vendors)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: theme.spacing.md,
            marginTop: theme.spacing.lg,
          }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.text.secondary}`,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.text.secondary,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.body,
              }}
            >
              Back
            </button>
            <button
              type="submit"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                backgroundColor: theme.colors.primary.coral,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                color: theme.colors.background.white,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.body,
              }}
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 