"use client";


import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useHostContext } from '../context/HostContext';
import { useUserContext } from '../context/UserContext';
import { auth } from "../lib/firebase";
import './tailwind.css';
import { theme } from '@/styles/theme';
import { EventSearchBar } from '@/components/EventSearchBar';
import Image from 'next/image';


export default function Header() {
  const { user, vendorProfile, getVendorProfile } = useUserContext();
  const { hostProfile, setHostProfile } = useHostContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      getVendorProfile();
    }
  }, [user]);

  const updateHostTrue = () => {
    setHostProfile(true); // Set the user as a host
  };

  const updateHostFalse = () => {
    setHostProfile(false); // Set the user as a vendor
  };

  // Handle opening dropdown
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  // Handle delayed closing
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200); // Short delay to prevent flickering
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
        <Image
          src="/logo.svg"
          alt="MarkitIt Logo"
          width={120}
          height={40}
        />
        <EventSearchBar />
      </div>
      
      <div style={{
        display: 'flex',
        gap: theme.spacing.xl,
        alignItems: 'center',
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          textDecoration: 'none',
          color: theme.colors.text.primary,
        }}>
          <Image src="/icons/home.svg" alt="Home" width={24} height={24} />
          <span>Home</span>
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
        
        <Link href="/profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          textDecoration: 'none',
          color: theme.colors.text.primary,
        }}>
          <Image src="/icons/profile.svg" alt="Profile" width={24} height={24} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}