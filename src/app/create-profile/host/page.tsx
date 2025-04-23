'use client';

import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUserContext } from '@/context/UserContext';

export default function HostProfilePage() {
  const router = useRouter();
  const { user } = useUserContext();

  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [eventCapacity, setEventCapacity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a host profile.');
      return;
    }

    try {
      const hostProfileData = {
        uid: user.uid,
        organizationName,
        organizationDescription,
        contactEmail,
        phoneNumber,
        website,
        eventTypes,
        eventCapacity,
        createdAt: new Date().toISOString(),
      };

      // Save the host profile data to Firestore
      await setDoc(doc(db, 'hostProfile', user.uid), hostProfileData);

      alert('Host profile created successfully!');
      router.push('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error creating host profile:', error);
      alert('An error occurred while creating your profile. Please try again.');
    }
  };

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: theme.spacing.xl,
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: theme.typography.fontSize.title,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xl,
          }}
        >
          Create Host Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: theme.colors.background.white,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.xl,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: theme.typography.fontSize.header,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.lg,
              }}
            >
              Basic Information
            </h2>

            <div
              style={{
                display: 'grid',
                gap: theme.spacing.lg,
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Organization Name*
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your organization name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
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
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Organization Description*
                </label>
                <textarea
                  required
                  placeholder="Tell us about your organization"
                  rows={4}
                  value={organizationDescription}
                  onChange={(e) => setOrganizationDescription(e.target.value)}
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
            <h2
              style={{
                fontSize: theme.typography.fontSize.header,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.lg,
              }}
            >
              Contact Information
            </h2>

            <div
              style={{
                display: 'grid',
                gap: theme.spacing.lg,
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Contact Email*
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your contact email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
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
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Phone Number*
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Website (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your website URL (e.g., https://www.example.com)"
                  value={website}
                  onChange={(e) => {
                    let url = e.target.value;
                    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                      url = 'https://' + url;
                    }
                    setWebsite(url);
                  }}
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.text.secondary}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.body,
                  }}
                />
                <span style={{
                  fontSize: theme.typography.fontSize.small,
                  color: theme.colors.text.secondary,
                  marginTop: theme.spacing.xs,
                  display: 'block',
                }}>
                  Include https:// or http:// in your URL
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: theme.typography.fontSize.header,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.lg,
              }}
            >
              Event Preferences
            </h2>

            <div
              style={{
                display: 'grid',
                gap: theme.spacing.lg,
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Event Types*
                </label>
                <select
                  required
                  multiple
                  value={eventTypes}
                  onChange={(e) =>
                    setEventTypes(Array.from(e.target.selectedOptions, (option) => option.value))
                  }
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
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Typical Event Capacity*
                </label>
                <select
                  required
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(e.target.value)}
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: theme.spacing.md,
              marginTop: theme.spacing.lg,
            }}
          >
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