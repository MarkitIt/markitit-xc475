'use client';

import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUserContext } from '../context/UserContext';
import { signOut } from "firebase/auth";
import './tailwind.css';

const Header: React.FC = () => {
  const { user, vendorProfile,getVendorProfile } = useUserContext();

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
            {user ? (   
              vendorProfile ? (
                <>
                  <Link href="/auth/login">Login/Sign Up</Link>
                  <Link href="/vendor-dashboard">Vendor Dashboard</Link>
                  <Link href="/applications">My Applications</Link>
                  <Link href="/settings">Settings</Link>
                  <Link href="/" onClick={handleLogout}>Logout</Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">Login/Sign Up</Link>
                  <Link href="/vendor-profile">Create a Vendor Profile</Link>
                  <Link href="/applications">My Applications</Link>
                  <Link href="/settings">Settings</Link>
                  <Link href="/" onClick={handleLogout}>Logout</Link>
                </>
              )
            ) : (
              <>
                <Link href="/auth/login">Login/Sign Up</Link>
                <Link href="/applications">My Applications</Link>
                <Link href="/settings">Settings</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
