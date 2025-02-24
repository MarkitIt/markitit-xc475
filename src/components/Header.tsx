import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";

const Header = () => {
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
            <Link href="/auth/login">Login/Sign Up</Link>
            <Link href="/vendor-profile">Create a Vendor Profile</Link>
            <Link href="/applications">My Applications</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
