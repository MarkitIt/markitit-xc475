'use client';

import React from 'react';
import { useUserContext } from '@/context/UserContext';

export default function VendorIdCheckPage() {
  const { user, vendorProfile } = useUserContext();
  
  // Function to get vendor ID with proper error handling
  const getVendorIdStatus = () => {
    // Case 1: User is not logged in
    if (!user) {
      return {
        status: "Not logged in",
        id: "No vendor ID available",
        hasId: false
      };
    }
    
    // Case 2: User is logged in but has no vendor profile
    if (!vendorProfile) {
      return {
        status: "Logged in, but no vendor profile",
        id: "No vendor ID available",
        hasId: false
      };
    }
    
    // Case 3: User is logged in and has a vendor profile
    const vendorId = vendorProfile.uid;
    if (!vendorId) {
      return {
        status: "Vendor profile exists, but no UID found",
        id: "No vendor ID available",
        hasId: false
      };
    }
    
    return {
      status: "Vendor profile active",
      id: vendorId,
      hasId: true
    };
  };
  
  const vendorInfo = getVendorIdStatus();
  
  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
      }}>
        Vendor ID Information
      </h1>
      
      <div style={{
        backgroundColor: vendorInfo.hasId ? '#f0f7f0' : '#fff0f0',
        border: `1px solid ${vendorInfo.hasId ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '5px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
          Status: {vendorInfo.hasId ? '✅ Available' : '❌ Not Available'}
        </h2>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>User logged in:</strong> {user ? '✅ Yes' : '❌ No'}
          {user && (
            <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
              <strong>User ID:</strong> {user.uid}
              <br />
              <strong>Email:</strong> {user.email}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Vendor profile:</strong> {vendorProfile ? '✅ Yes' : '❌ No'}
        </div>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <strong>Vendor ID:</strong> {vendorInfo.id}
        </div>
      </div>
      
      <div style={{ fontSize: '14px', color: '#666' }}>
        <p>
          This information is used by the ranking system to calculate personalized event scores.
        </p>
        <p>
          {!vendorInfo.hasId && 'To get a vendor ID, please complete your vendor profile setup.'}
        </p>
      </div>
    </div>
  );
} 