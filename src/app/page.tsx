"use client";

import Link from "next/link";
import "./tailwind.css";
import { theme } from '@/styles/theme';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="landing-background">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.lg,
        padding: '0 4rem',
      }}>
        <div style={{
          maxWidth: '800px',
          position: 'relative',
        }}>
          <h1 className="landing-title coral">
            Pop Up.
          </h1>
          <h1 className="landing-title dark-blue">
            Stand Out.
          </h1>
          <h1 className="landing-title beige">
            Sell More.
          </h1>
          
          <Image 
            src="/images/underline.png" 
            alt="Decorative underline" 
            width={500} 
            height={20}
            className="title-underline-image"
          />
          
          <p className="landing-description">
            a one-stop platform for finding events, managing applications, and connecting with a thriving vendor community.
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
