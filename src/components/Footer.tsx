import React from 'react';
import styles from './Footer.module.css'; // Adjust the path as necessary
import logo from '../assets/logo.png'; // replace with actual logo path
import { theme } from '@/styles/theme'; // Adjust the path as necessary
import Image from 'next/image';
import Link from "next/link";

export default function Footer () {
  return (
    <footer className={styles.footer}>
        <div className={styles.footerContainer}>
            <div className={`${styles.footerSection} ${styles.logoSection}`}>
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={800}
                    height={600}
                    style={{
                    objectFit: 'contain',
                    borderRadius: theme.borderRadius.lg,
                    maxWidth: '100%',
                    height: 'auto',
                    }}
                />
                <p>© MarkitIt 2025</p>
            </div>
            <div className={styles.footerSection}>
                <h4 className={styles.footerHeading}>Customer Service</h4>
                <Link href="/faq" className={styles.footerLink}>
                    FAQ
                </Link>
                <Link href="/terms" className={styles.footerLink}>
                    Terms and Conditions
                </Link>
                <Link href="/privacy-policy" className={styles.footerLink}>
                    Privacy Policy
                </Link>
            </div>
            <div className={styles.footerSection}>
                <h4 className={styles.footerHeading}>About Us</h4>
                <Link href="/about-us" className={styles.footerLink}>
                    Our Story
                </Link>
            </div>
            <div className={styles.footerSection}>
                <h4 className={styles.footerHeading}>Connect</h4>
                <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                >
                    Instagram
                </a>
                <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                >
                    LinkedIn
                </a>
            </div>
        </div>
    </footer>
  );
};

