'use client';

import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const Header = () => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
              <>
                
                <Link href="/auth/login">Login/Sign Up</Link>
                <Link href="/vendor-profile">Create a Vendor Profile</Link>
                <Link href="/applications">My Applications</Link>
                <Link href="/settings">Settings</Link>
              </>
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
