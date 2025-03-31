'use client';

import React from 'react';
import { useUserContext } from '@/context/UserContext';
import { getVendorId, isValidVendorId } from '@/utils/getVendorId';

/**
 * A component to display the vendor ID of the currently logged-in user
 * Can be used anywhere in the application where vendor ID information is needed
 */
export default function VendorIdDisplay() {
  const { user, vendorProfile } = useUserContext();
  const vendorId = getVendorId(user, vendorProfile);
  const isValid = isValidVendorId(vendorId);
  
  return (
    <div style={{ 
      padding: '15px',
      backgroundColor: isValid ? '#f0f7f0' : '#fff0f0',
      border: `1px solid ${isValid ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Vendor ID Information</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> {isValid ? '✅ Available' : '❌ Not Available'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>User logged in:</strong> {user ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Vendor profile:</strong> {vendorProfile ? '✅ Yes' : '❌ No'}
      </div>
      
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace'
      }}>
        <strong>Vendor ID:</strong> {vendorId}
      </div>
    </div>
  );
} 