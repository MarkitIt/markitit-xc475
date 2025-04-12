"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from '../context/UserContext';
import { auth } from "../lib/firebase";
import './tailwind.css';
import { theme } from '@/styles/theme';
import { EventSearchBar } from '@/components/EventSearchBar';
import Image from 'next/image';

const dropdownLinkStyle = {
  display: 'block',
  padding: theme.spacing.sm,
  color: theme.colors.text.primary,
  textDecoration: 'none',
  borderRadius: theme.borderRadius.sm,
};

export default function Header() {
  const { user, vendorProfile, getVendorProfile,hostProfile,getHostProfile } = useUserContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.role === 'vendor') {
      getVendorProfile();
    }
    else if (user?.role === 'host') {
      getHostProfile();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderProfileSection = () => {
    if (!user) {
      return (
        <Link href="/auth/login" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          textDecoration: 'none',
          color: theme.colors.text.primary,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          border: `1px solid ${theme.colors.primary.black}`,
          borderRadius: theme.borderRadius.md,
        }}>
          <span>Login / Sign Up</span>
        </Link>
      );
    }

    if (!vendorProfile && !hostProfile) {
      return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              color: theme.colors.text.primary,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: `1px solid ${theme.colors.primary.black}`,
              borderRadius: theme.borderRadius.md,
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <span>Create Profile</span>
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: theme.spacing.xs,
              backgroundColor: theme.colors.background.white,
              border: `1px solid ${theme.colors.primary.black}`,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.sm,
              minWidth: '200px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
            }}>
              {user?.role === 'host' && (
                 <>
                   <Link href="/create-profile/host" className="dropdown-link" style={dropdownLinkStyle}>
                     Create Host Profile
                   </Link>
                   <button
                     onClick={handleLogout}
                     className="dropdown-link text-coral"
                     style={{
                       display: 'block',
                       width: '100%',
                       padding: theme.spacing.sm,
                       color: theme.colors.primary.coral,
                       background: 'none',
                       border: 'none',
                       textAlign: 'left',
                       cursor: 'pointer',
                       borderRadius: theme.borderRadius.sm,
                     }}
                   >
                     Logout
                   </button>
                 </>
               )}
               {user?.role === 'vendor' && (
                 <>
                 <Link href="/vendor-profile" className="dropdown-link" style={dropdownLinkStyle}>
                   Create Vendor Profile
                 </Link>
                 <button
                   onClick={handleLogout}
                   className="dropdown-link text-coral"
                   style={{
                     display: 'block',
                     width: '100%',
                     padding: theme.spacing.sm,
                     color: theme.colors.primary.coral,
                     background: 'none',
                     border: 'none',
                     textAlign: 'left',
                     cursor: 'pointer',
                     borderRadius: theme.borderRadius.sm,
                   }}
                 >
                   Logout
                 </button>
               </>
               )}
               {user?.role === "" && (
                 <>
                 <Link href="/create-profile" className="dropdown-link" style={dropdownLinkStyle}>
                   Create Profile
                 </Link>
                 <button
                   onClick={handleLogout}
                   className="dropdown-link text-coral"
                   style={{
                     display: 'block',
                     width: '100%',
                     padding: theme.spacing.sm,
                     color: theme.colors.primary.coral,
                     background: 'none',
                     border: 'none',
                     textAlign: 'left',
                     cursor: 'pointer',
                     borderRadius: theme.borderRadius.sm,
                   }}
                 >
                   Logout
                 </button>
               </>
               )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            color: theme.colors.text.primary,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.primary.black}`,
            borderRadius: theme.borderRadius.md,
            background: 'none',
            cursor: 'pointer',
          }}
        >
          <Image src="/icons/profile.svg" alt="Profile" width={24} height={24} />
          <span>Profile</span>
        </button>

        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: theme.spacing.xs,
            backgroundColor: theme.colors.background.white,
            border: `1px solid ${theme.colors.primary.black}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.sm,
            minWidth: '200px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
          }}>
            {hostProfile ? (
              <>
                <Link href="/host-dashboard" className="dropdown-link" style={dropdownLinkStyle}>
                  Dashboard
                </Link>
                <Link href="/my-events" className="dropdown-link" style={dropdownLinkStyle}>
                  My Events
                </Link>
              </>
            ) : (
              <>
                <Link href="/vendor-dashboard" className="dropdown-link" style={dropdownLinkStyle}>
                  Dashboard
                </Link>
                <Link href="/my-applications" className="dropdown-link" style={dropdownLinkStyle}>
                  My Applications
                </Link>
              </>
            )}
            <Link href="/settings" className="dropdown-link" style={dropdownLinkStyle}>
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="dropdown-link text-coral"
              style={{
                display: 'block',
                width: '100%',
                padding: theme.spacing.sm,
                color: theme.colors.primary.coral,
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: theme.borderRadius.sm,
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.xxl,
      backgroundColor: theme.colors.background.main,
      borderBottom: `1px solid ${theme.colors.primary.black}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image
            src="/images/logo.png"
            alt="MarkitIt Logo"
            width={250}
            height={50}
            style={{
              objectFit: 'contain'
            }}
          />
        </Link>
        <EventSearchBar />
      </div>
      
      <div style={{
        display: 'flex',
        gap: theme.spacing.xl,
        alignItems: 'center',
      }}>
        <Link href="/search-events" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          textDecoration: 'none',
          color: theme.colors.text.primary,
        }}>
          <Image src="/icons/home.svg" alt="Home" width={24} height={24} />
          Home
        </Link>
        
        <Link href="/community" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          textDecoration: 'none',
          color: theme.colors.text.primary,
        }}>
          <Image src="/icons/community.svg" alt="Community" width={24} height={24} />
          <span>Community</span>
        </Link>
        
        <Link href="/notifications" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          textDecoration: 'none',
          color: theme.colors.text.primary,
        }}>
          <Image src="/icons/bell.svg" alt="Notifications" width={24} height={24} />
          <span>Notifications</span>
        </Link>
        
        {renderProfileSection()}
      </div>
    </nav>
  );
}