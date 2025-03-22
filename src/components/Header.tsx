'use client';

import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useEffect } from "react";
import { useHostContext } from '../context/HostContext';
import { useUserContext } from '../context/UserContext';
import { auth } from "../lib/firebase";
import styles from "./Header.module.css";
import './tailwind.css';
import { get } from "http";

const Header: React.FC = () => {
  const { user, vendorProfile, getVendorProfile } = useUserContext();
  const { hostProfile, setHostProfile, } = useHostContext();

  
  useEffect(() => {
    if (user) {
      getVendorProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const updateHostTrue = () => {
    setHostProfile(true); // Set the user as a host
  };
  const updateHostFalse = () => {
    setHostProfile(false); // Set the user as a host
  };

  const renderProfileOptions = () => {
    if (!user) {
      return (
        <>
          <Link href="/auth/login">Login/Sign Up</Link>
        </>
      );
    }

    
    if (hostProfile){
      if (vendorProfile){
        return (
          <>
            <Link href="/" onClick={updateHostFalse}>Become a vendor</Link>
            <Link href="/vendor-dashboard">Vendor Dashboard</Link>
            <Link href="/application">My Applications</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/" onClick={handleLogout}>Logout</Link>
          </>
        );
      }
      return (
        <>
          <Link href="/" onClick={updateHostFalse}>Become a vendor</Link>
          <Link href="/vendor-profile">Create a Vendor Profile</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/" onClick={handleLogout}>Logout</Link>
        </>
      )
    }

    if (!hostProfile) {
      if (vendorProfile){
        return (
          <>
            <Link href="/" onClick={updateHostTrue}>Become a host</Link>
            <Link href="/vendor-dashboard">Vendor Dashboard</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/" onClick={handleLogout}>Logout</Link>
          </>
        );
      }
      return (
        <>
          <Link href="/" onClick={updateHostTrue}>Become a host</Link>
          <Link href="/vendor-profile">Create a Vendor Profile</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/" onClick={handleLogout}>Logout</Link>
        </>
      )
    }

  };

  return (
    <header className={styles.header}>
      {/* Left Section: Hamburger + Home + Community */}
      <div className={styles.leftSection}>
        <div className={styles.hamburger}>☰</div> {/* Hamburger Icon */}
        <nav className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/community">Community</Link>
        </nav>
      </div>

      {/* Centered Brand Name */}
      <div className={styles.brand}>Markitit</div>

      {/* Right Section: Notifications + Profile (Dropdown) */}
      <div className={styles.rightSection}>
        <Link href="/notifications">Notifications</Link>
        <div className={styles.profile}>
          <span>Profile ▼</span>
          <div className={styles.dropdown}>
            {renderProfileOptions()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
