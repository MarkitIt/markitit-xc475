"use client";

import Link from "next/link";
import "./tailwind.css";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showNewsletter, setShowNewsletter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNewsletter(true), 2500); // Show after 2.5s
    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await addDoc(collection(db, "newsletter"), { email, createdAt: new Date() });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError("There was an error subscribing. Please try again later.");
    }
  };

  return (
    <main className={styles.landingBackground}>
      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1 className={`${styles.landingTitle} ${styles.coral}`}>Pop Up.</h1>
          <h1 className={`${styles.landingTitle} ${styles.darkBlue}`}>Stand Out.</h1>
          <h1 className={`${styles.landingTitle} ${styles.white}`}>Own Success.</h1>

          <Image
            src="/images/underline.png"
            alt="Decorative underline"
            width={500}
            height={20}
            className={styles.titleUnderlineImage}
          />

          <p className={styles.landingDescription}>
            a one-stop platform for finding events, managing applications, and
            connecting with a thriving vendor community.
          </p>
        </div>

        <div className={styles.heroImageContainer}>
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/homeImage.png"
              alt="Vendor Shop Display"
              width={800}
              height={600}
              className={styles.heroImage}
            />
            <div className={`${styles.circle} ${styles.topRightCircle}`} />
            <div className={`${styles.circle} ${styles.bottomLeftCircle}`} />
          </div>
        </div>
        
      </div>
      <div className={styles.discoverSection}>
        <div className={styles.discoverText}>
          <h1 className={`${styles.landingTitle} ${styles.darkBlue}`}>Discover MarkitIt</h1>
          <p className={styles.discoverDescription}>
            These features make our platform
          </p>
        </div>
          
      </div>

      {/* Curve*/}
      <div className={styles.curveSection}>
        
      <svg width="0" height="0">
        <defs>
          <clipPath id="concaveClip" clipPathUnits="objectBoundingBox">
            <path d="
              M0,0 
              C0.2,1 0.8,1 1,0 
              L1,1 
              L0,1 
              Z
            " />
          </clipPath>
        </defs>
      </svg>

      </div>
      {/* Features Section */}
      <div className={styles.featuresSection}>
        {/* Content container */}
        <div className={styles.featuresContainer}>
          {[
            {
              title: "Event Matching",
              desc: "Discover the best pop-ups for your brand with AI-powered event recommendations.",
              img: "/images/eventMatchingIcon.png",
              link: "/search-events", 
            },
            {
              title: "Fast Applications",
              desc: "Apply to multiple events instantly with auto-filled details and status tracking.",
              img: "/images/fastApplicationIcon.png",
              link: "/search-events", 
            },
            {
              title: "Financial Calculator",
              desc: "Plan smarter with cost breakdowns and ROI predictions to maximize your earnings.",
              img: "/images/financialCalculatorIcon.png",
              link: "/vendor-dashboard", 
            },
            {
              title: "Host Rating",
              desc: "Avoid bad experiences with verified vendor reviews and a trust-based host vetting system.",
              img: "/images/hostRatingIcon.png",
              link: "/search-events", 
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={styles.feature}
            >
              <div className={styles.featureImageContainer}>
                <Image
                  src={feature.img}
                  alt={`${feature.title} Icon`}
                  width={100}
                  height={100}
                  className={styles.featureImage}
                />
              </div>

              <div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <div className={styles.featureContent}>
                  <Link href={feature.link}>
                    <button className={styles.exploreButton}>EXPLORE</button>
                  </Link>
                  <p className={styles.featureDescription}>{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Popup Modal */}
      {showNewsletter && (
        <div className={styles.newsletterModalOverlay}>
          <div className={styles.newsletterModal}>
            <button className={styles.newsletterClose} onClick={() => setShowNewsletter(false)}>&times;</button>
            <h2 className={styles.newsletterTitle}>Subscribe to our Newsletter</h2>
            <p className={styles.newsletterDescription}>
              Get the latest features, updates, and pop-up news delivered to your inbox!
            </p>
            <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className={styles.newsletterInput}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={submitted}
                style={{ background: '#fff', color: '#000' }}
              />
              <button
                type="submit"
                className={styles.newsletterButton}
                disabled={submitted}
              >
                {submitted ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
            {error && <div className={styles.newsletterError}>{error}</div>}
          </div>
        </div>
      )}
    </main>
  );
}
