'use client';

import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { validateVendorEmail } from '@/utils/validateVendorEmail';
import { theme } from '@/styles/theme';

/**
 * A component that verifies and displays whether a user's auth email matches their vendor profile email
 */
export default function EmailValidator() {
  const { user, vendorProfile } = useUserContext();
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    emailsMatch: boolean;
    authEmail: string | null;
    profileEmail: string | null;
    errorMessage: string | null;
    vendorProfileId: string | null;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkEmailMatch() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const result = await validateVendorEmail(user);
        setValidationResult(result);
      } catch (error) {
        console.error('Error validating email:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkEmailMatch();
  }, [user]);

  if (isLoading) {
    return (
      <div style={{
        padding: '1rem',
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.white,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        margin: '1rem 0',
      }}>
        <p>Checking email validation...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        padding: '1rem',
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.white,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        margin: '1rem 0',
        color: theme.colors.text.secondary,
      }}>
        <p>Please sign in to validate your email.</p>
      </div>
    );
  }

  if (!validationResult) {
    return (
      <div style={{
        padding: '1rem',
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.white,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        margin: '1rem 0',
        color: theme.colors.primary.coral,
      }}>
        <p>Failed to validate email. Please try again later.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: theme.borderRadius.md,
      backgroundColor: validationResult.isValid 
        ? theme.colors.background.white 
        : '#FFF5F5',
      border: `1px solid ${validationResult.isValid 
        ? theme.colors.text.secondary 
        : theme.colors.primary.coral}`,
      margin: '1rem 0',
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: validationResult.isValid 
          ? theme.colors.text.primary 
          : theme.colors.primary.coral,
      }}>
        Email Validation Status
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}>
          <span style={{ 
            fontWeight: 'bold',
            marginRight: '0.5rem',
          }}>
            Authentication Email:
          </span>
          <span>{validationResult.authEmail || 'Not available'}</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}>
          <span style={{ 
            fontWeight: 'bold',
            marginRight: '0.5rem',
          }}>
            Vendor Profile Email:
          </span>
          <span>{validationResult.profileEmail || 'Not available'}</span>
        </div>
      </div>
      
      {validationResult.isValid ? (
        <div style={{
          backgroundColor: '#F0FFF4',
          padding: '0.75rem',
          borderRadius: theme.borderRadius.sm,
          color: '#276749',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ marginRight: '0.5rem' }}>✓</span>
          <span>Email addresses match correctly.</span>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FFF5F5',
          padding: '0.75rem',
          borderRadius: theme.borderRadius.sm,
          color: theme.colors.primary.coral,
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ marginRight: '0.5rem' }}>✗</span>
          <span>{validationResult.errorMessage || 'Email validation failed'}</span>
        </div>
      )}
    </div>
  );
} 