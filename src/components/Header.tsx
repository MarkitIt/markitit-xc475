"use client";

import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from '../context/UserContext';
import { auth } from "../lib/firebase";
import styles from './Header.module.css';
import { EventSearchBar } from '@/components/EventSearchBar';
import { useSearchContext } from "@/context/SearchContext";
import { useRouter, usePathname } from "next/navigation"; 
import Image from 'next/image';

export default function Header() {
  const { user, vendorProfile, hostProfile, getVendorProfile, getHostProfile } = useUserContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); 
  // const { setSearchQuery } = useSearchContext();

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;  // Check if the current route matches the path


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

  // const handleSearch = (query: string) => {
  //   if (query.trim()) {
  //     setSearchQuery(query); // Update the search query in the context
  //     router.push('/search-events'); // Navigate to search-events with query
  //   }
  // };

  const renderProfileSection = () => {
    if (!user) {
      return (
        <Link href="/auth/login" className={styles.loginButton}>
          <span>Login / Sign Up</span>
        </Link>
      );
    }

    if (user.role && user.role !== 'none') {
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
    }

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
        {/* <EventSearchBar onSearch={handleSearch}/> */}
      </div>
      
      <div className={styles.rightSection}>
        <Link href="/search-events" className={styles.navLink}>
          <Image
            src="/icons/home.svg"
            alt="Home"
            width={24}
            height={24}
            style={{
              filter: isActive("/search-events") ? "invert(28%) sepia(77%) saturate(747%) hue-rotate(340deg) brightness(91%) contrast(94%)" : "none",
            }}
          />
          <span style={{ color: isActive("/search-events") ? "#f15152" : "inherit" }}>Home</span>
        </Link>
        
        <Link href="/community" className={styles.navLink}>
          <Image
            src="/icons/community.svg"
            alt="Community"
            width={24}
            height={24}
            style={{
              filter: isActive("/community") ? "invert(28%) sepia(77%) saturate(747%) hue-rotate(340deg) brightness(91%) contrast(94%)" : "none",
            }}
          />
          <span style={{ color: isActive("/community") ? "#f15152" : "inherit" }}>Community</span>
        </Link>
        
        <Link href="/notifications" className={styles.navLink}>
          <Image
            src="/icons/bell.svg"
            alt="Notifications"
            width={24}
            height={24}
            style={{
              filter: isActive("/notifications") ? "invert(28%) sepia(77%) saturate(747%) hue-rotate(340deg) brightness(91%) contrast(94%)" : "none",
            }}
          />
          <span style={{ color: isActive("/notifications") ? "#f15152" : "inherit" }}>Notifications</span>
        </Link>
        
        {renderProfileSection()}
      </div>
    </header>
  );
}