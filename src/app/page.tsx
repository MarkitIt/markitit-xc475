"use client";

import Link from "next/link";
import "./tailwind.css";
import { theme } from '@/styles/theme';
import { EventSearchBar } from '@/components/EventSearchBar';
import Image from 'next/image';

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
      }}>
        <div style={{
          maxWidth: '600px',
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
            left: '50%',
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
    </main>
  );
}
