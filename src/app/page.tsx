"use client";

import Link from "next/link";
import "./tailwind.css";
import { theme } from '@/styles/theme';
import { EventSearchBar } from '@/components/EventSearchBar';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <main style={{
      background: theme.colors.background.gradient,
      minHeight: '100vh',
      padding: theme.spacing.xl,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
        marginLeft: theme.spacing.xl,
      }}>
        <div style={{
          maxWidth: '600px',
          position: 'absolute',
          left: '15%',
        }}>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.coral,
            marginBottom: theme.spacing.md,
            lineHeight: 1.2,
          }}>
            Pop Up.
          </h1>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.darkBlue,
            marginBottom: theme.spacing.md,
            lineHeight: 1.2,
          }}>
            Stand Out.
          </h1>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.background.white,
            marginBottom: theme.spacing.xl,
            lineHeight: 1.2,
          }}>
            Sell More.
            <Image
              src="/images/homeVector.png"
              alt="Vendor Shop Display"
              width={400}
              height={100}
              style={{
                objectFit: 'contain',
                borderRadius: theme.borderRadius.lg,
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </h1>
          
          <p style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.secondary,
            maxWidth: '450px',
            lineHeight: 1.5,
          }}>
            a one-stop platform for finding top-tier events, managing applications, and connecting with a thriving vendor community.
          </p>
        </div>

        <div style={{
          position: 'relative',
          width: '1200px',
          height: '800px',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '110%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              src="/images/homeImage.png"
              alt="Vendor Shop Display"
              width={1000}
              height={800}
              style={{
                objectFit: 'contain',
                borderRadius: theme.borderRadius.lg,
                maxWidth: '100%',
                height: 'auto',
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              backgroundColor: theme.colors.primary.coral,
              borderRadius: '50%',
              opacity: 0.2,
              zIndex: -1,
            }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '150px',
              height: '150px',
              backgroundColor: theme.colors.secondary.yellow,
              borderRadius: '50%',
              opacity: 0.2,
              zIndex: -1,
            }} />
          </div>
        </div>
        
      </div>
      <div style={{
          display: 'flex',
          justifyContent: 'center', // Center horizontally
          alignItems: 'center', // Center vertically
          marginTop: theme.spacing.sm,
          marginBottom: theme.spacing.xl,
        }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.title,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary.darkBlue,
            marginBottom: theme.spacing.md,
            lineHeight: 1.2,
          }}>
            Discover Markiit
          </h1>
          <p style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.background.white,
            maxWidth: '450px',
            lineHeight: 1.5,
            margin: '0 auto',
          }}>
            These features make our platform
          </p>
        </div>
          
      </div>

      {/* Features Section */}
      <div
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: theme.spacing.lg,
          maxWidth: "650px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        {[
          {
            title: "Event Matching",
            desc: "Discover the best pop-ups for your brand with AI-powered event recommendations.",
          },
          {
            title: "Fast Applications",
            desc: "Apply to multiple events instantly with auto-filled details and status tracking.",
          },
          {
            title: "Financial Calculator",
            desc: "Plan smarter with cost breakdowns and ROI predictions to maximize your earnings.",
          },
          {
            title: "Host Rating",
            desc: "Avoid bad experiences with verified vendor reviews and a trust-based host vetting system.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: theme.spacing.xl,
              gap: theme.spacing.sm,
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.primary.coral,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                color: theme.colors.background.white,
                fontSize: theme.typography.fontSize.body,
              }}
            >
              🎯
            </div>
            <div>
              <h3
                style={{
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.header,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.secondary.yellow,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {feature.title}
              </h3>
              <div
                style={{
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  gap: theme.spacing.md, 
                }}
              >
                <button
                  style={{
                    marginTop: theme.spacing.xs,
                    marginBottom: theme.spacing.sm,
                    fontSize: theme.typography.fontSize.body,
                    backgroundColor: theme.colors.primary.coral,
                    color: theme.colors.background.white,
                    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                    borderRadius: theme.borderRadius.md,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  EXPLORE
                </button>
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.body,
                    color: theme.colors.background.white,
                    lineHeight: 1.5,
                    margin: 0, 
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
