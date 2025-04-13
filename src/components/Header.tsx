"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from '../context/UserContext';
import { auth } from "../lib/firebase";
import styles from './Header.module.css';
import { EventSearchBar } from '@/components/EventSearchBar';
import Image from 'next/image';

export default function Header() {
  const { user, vendorProfile, hostProfile, getVendorProfile, getHostProfile } = useUserContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      if (user.role === 'vendor') {
        await getVendorProfile();
      } else if (user.role === 'host') {
        await getHostProfile();
      }
    };
    
    loadProfile();
  }, [user, user?.role]);

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
        <Link href="/auth/login" className={styles.loginButton}>
          <span>Login / Sign Up</span>
        </Link>
      );
    }

    if (user.role === 'none' || (!vendorProfile && !hostProfile)) {
      return (
        <div ref={dropdownRef} className={styles.profile}>
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className={styles.profileButton}>
            <span>Create Profile</span>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <Link href="/create-profile" className={styles.dropdownLink}>
                Create Profile
              </Link>
              <button onClick={handleLogout} className={`${styles.dropdownLink} ${styles.logoutButton}`}>
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={dropdownRef} className={styles.profile}>
        <button onClick={() => setDropdownOpen(!isDropdownOpen)} className={styles.profileButton}>
          <Image src="/icons/profile.svg" alt="Profile" width={24} height={24} />
          <span>Profile</span>
        </button>

        {isDropdownOpen && (
          <div className={styles.dropdown}>
            {user.role === 'host' ? (
              <>
                <Link href="/host-dashboard" className={styles.dropdownLink}>
                  Dashboard
                </Link>
                <Link href="/my-events" className={styles.dropdownLink}>
                  My Events
                </Link>
              </>
            ) : (
              <>
                <Link href="/vendor-dashboard" className={styles.dropdownLink}>
                  Dashboard
                </Link>
                <Link href="/my-applications" className={styles.dropdownLink}>
                  My Applications
                </Link>
              </>
            )}
            <Link href="/settings" className={styles.dropdownLink}>
              Settings
            </Link>
            <button onClick={handleLogout} className={`${styles.dropdownLink} ${styles.logoutButton}`}>
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/images/logo.png"
            alt="MarkitIt Logo"
            width={250}
            height={50}
            style={{ objectFit: 'contain' }}
          />
        </Link>
        <EventSearchBar />
      </div>
      
      <div className={styles.rightSection}>
        <Link href="/search-events" className={styles.navLink}>
          <Image src="/icons/home.svg" alt="Home" width={24} height={24} />
          Home
        </Link>
        
        <Link href="/community" className={styles.navLink}>
          <Image src="/icons/community.svg" alt="Community" width={24} height={24} />
          <span>Community</span>
        </Link>
        
        <Link href="/notifications" className={styles.navLink}>
          <Image src="/icons/bell.svg" alt="Notifications" width={24} height={24} />
          <span>Notifications</span>
        </Link>
        
        {renderProfileSection()}
      </div>
    </header>
  );
}