'use client';

import React from 'react';
import EmailValidator from '@/components/EmailValidator';
import { theme } from '@/styles/theme';
import Link from 'next/link';

export default function EmailValidatorPage() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: theme.typography.fontFamily.primary,
    }}>
      <h1 style={{
        fontSize: '1.75rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: theme.colors.text.primary,
      }}>
        Email Validation Check
      </h1>
      
      <p style={{
        marginBottom: '1.5rem',
        color: theme.colors.text.secondary,
      }}>
        This page checks that your authentication email (the one you use to log in) matches 
        the email in your vendor profile. This ensures that only you can access your vendor account.
      </p>
      
      <EmailValidator />
      
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.white,
        border: `1px solid ${theme.colors.text.secondary}`,
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: theme.colors.text.primary,
        }}>
          Why is this important?
        </h2>
        
        <ul style={{
          marginLeft: '1.5rem',
          listStyleType: 'disc',
          marginBottom: '1rem',
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Each email can only be associated with one vendor profile
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Your authentication email and vendor profile email must match to ensure account security
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            This helps prevent unauthorized access to your vendor account
          </li>
        </ul>
        
        <p style={{ marginTop: '1.5rem' }}>
          <Link href="/vendor-profile" style={{
            color: theme.colors.primary.coral,
            textDecoration: 'underline',
          }}>
            Update your vendor profile
          </Link>
          {' '} if you need to change your email or other information.
        </p>
      </div>
    </div>
  );
} 