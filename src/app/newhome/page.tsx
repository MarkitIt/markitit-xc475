"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './newhome.module.css';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Animation for sticky header - RE-ADD
const stickyHeaderVariants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function NewHomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [showStickyHeader, setShowStickyHeader] = useState(false); // Re-added state

  const heroRef = useRef<HTMLElement>(null); // Re-added ref for the hero section
  const initialLogoRef = useRef<HTMLDivElement>(null); // Ref for the initial static logo container

  useEffect(() => {
    const handleScroll = () => {
      let showSticky = false;
      if (initialLogoRef.current) {
        // Option 1: Show sticky when initial logo is scrolled out of view
        // const initialLogoBottom = initialLogoRef.current.getBoundingClientRect().bottom;
        // if (initialLogoBottom < 0) { 
        //   showSticky = true;
        // }

        // Option 2: Show sticky after scrolling a certain amount (e.g. height of initial logo area or fixed value)
        // This is often simpler and more reliable than tracking specific element visibility during scroll.
        if (window.scrollY > (initialLogoRef.current.offsetHeight + 20)) { // +20 for a small buffer
            showSticky = true;
        }

      } else if (window.scrollY > 100) { // Fallback if ref not immediately available or for simpler threshold
        showSticky = true;
      }
      setShowStickyHeader(showSticky);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check in case page loads scrolled down
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Brevo global variable setup
  useEffect(() => {
    window.REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
    window.LOCALE = 'en';
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
    window.REQUIRED_ERROR_MESSAGE = "This field cannot be left blank. ";
    window.GENERIC_INVALID_MESSAGE = "The information provided is invalid. Please review the field format and try again.";
    window.translation = {
      common: {
        selectedList: '{quantity} list selected',
        selectedLists: '{quantity} lists selected',
        selectedOption: '{quantity} selected',
        selectedOptions: '{quantity} selected',
      }
    };
    // window.AUTOHIDE = Boolean(0); // This was commented out, ensure it's correct. If it means false, it's fine.
                                     // If AUTOHIDE needs to be a global variable, it should be window.AUTOHIDE = false;
                                     // Or if it's a specific Brevo configuration, ensure it's set as they expect.
                                     // For now, assuming Boolean(0) which is false is fine.
    (window as any).AUTOHIDE = false;

  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');
    if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    try {
      console.log('Newsletter submitted:', newsletterEmail);
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => {
        setNewsletterSubmitted(false);
      }, 3000); 
    } catch (err) {
      console.error("Newsletter submission error:", err);
      setNewsletterError('There was an error subscribing. Please try again.');
    }
  };

  const features = [
    { title: "Smart Aggregation", description: "Events from thousands of sources, enhanced by AI to show what matters most to vendors.", icon: "/gifs/aggregate.gif" },
    { title: "Personalized Matching", description: "Find the best-fit events using AI-powered recommendations tailored to your brand.", icon: "/gifs/search.gif" },
    { title: "1-Click Applications", description: "Apply to events with auto-filled details and real-time tracking.", icon: "/gifs/click.gif" },
    { title: "Host Ratings", description: "Avoid risky events with a transparent, vendor-driven review system.", icon: "/gifs/rate.gif" },
  ];

  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
    </svg>
  );

  return (
    <>
      <Head>
        <style>
          {`
            @font-face {
              font-display: block;
              font-family: Roboto;
              src: url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/7529907e9eaf8ebb5220c5f9850e3811.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/normal/normal/25c678feafdc175a70922a116c9be3e7.woff) format("woff")
            }

            @font-face {
              font-display: fallback;
              font-family: Roboto;
              font-weight: 600;
              src: url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/6e9caeeafb1f3491be3e32744bc30440.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/medium/normal/71501f0d8d5aa95960f6475d5487d4c2.woff) format("woff")
            }

            @font-face {
              font-display: fallback;
              font-family: Roboto;
              font-weight: 700;
              src: url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/3ef7cf158f310cf752d5ad08cd0e7e60.woff2) format("woff2"), url(https://assets.brevo.com/font/Roboto/Latin/bold/normal/ece3a1d82f18b60bcce0211725c476aa.woff) format("woff")
            }

            #sib-container input:-ms-input-placeholder {
              text-align: left;
              font-family: Helvetica, sans-serif;
              color: #c0ccda;
            }

            #sib-container input::placeholder {
              text-align: left;
              font-family: Helvetica, sans-serif;
              color: #c0ccda;
            }

            #sib-container textarea::placeholder {
              text-align: left;
              font-family: Helvetica, sans-serif;
              color: #c0ccda;
            }

            #sib-container a {
              text-decoration: underline;
              color: #2BB2FC;
            }
          `}
        </style>
        <link rel="stylesheet" href="https://sibforms.com/forms/end-form/build/sib-styles.css" />
      </Head>
      <div className={styles.container}>
        {/* Static Page Logo (visible on load) */}
        <div ref={initialLogoRef} className={styles.pageLogoContainer}>
          <Link href="/" passHref>
              {/* Ensure this is your main, larger logo if desired, or a simpler version */}
              <Image src="/images/logo.png" alt="MarkitIt Logo" width={180} height={50} className={styles.pageLogo} />
          </Link>
        </div>

        {/* Sticky Mini-Header (appears on scroll) */}
        <AnimatePresence>
          {showStickyHeader && (
            <motion.div
              className={styles.stickyMiniHeader}
              variants={stickyHeaderVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Link href="/" passHref>
                  {/* This logo can be the same or a slightly smaller/different version for the sticky bar */}
                  <Image src="/images/mLogo.png" alt="MarkitIt Logo" width={120} height={35} className={styles.stickyLogo} />
              </Link>
              <Link href="/auth/signup" passHref>
                  <motion.button 
                      className={styles.stickyButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                      Get Started Today
                  </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.section
          ref={heroRef} // heroRef can still be useful for other calculations or animations if needed
          className={styles.heroSection} 
          // Adjust paddingTop to ensure hero content starts below the initial static logo
          // The exact value depends on the height of .pageLogoContainer
          style={{ paddingTop: '100px' }} // Example: 100px, adjust this value!
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.heroLayoutContainer}> 
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Your <span className={styles.heroHighlight}>Business</span>.<br />
                Your <span className={styles.heroHighlight}>Booth</span>.<br />
                <span className={`${styles.heroHighlight} ${styles.heroBreakthrough}`}>Your Breakthrough.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                The AI-powered platform built for small business, vendors to discover, apply to, and thrive at pop-up events.
              </p>
              <div className={styles.heroButtons}>
                <Link href="/auth/signup" passHref>
                  <motion.button 
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link href="#how-it-works" passHref> 
                  <motion.button 
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    How it Works
                  </motion.button>
                </Link>
              </div>
            </div>
            <div className={styles.heroImageContainer}>
              <Image
                src="/images/newhome.png" 
                alt="Pop-up event vendor setup with various products on a table"
                width={800} 
                height={600} 
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </motion.section>

        {/* Feature Categories Section */}
        <motion.section
          className={`${styles.standardSectionContent} ${styles.featuresSection}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className={styles.sectionTitle}>Unlock Your Pop-Up Potential</h2>
          <p className={styles.sectionSubtitle}>
              MarkitIt provides everything you need to succeed, from finding the perfect event to managing your applications and network.
          </p>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
                }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <div className={styles.featureIconContainer}>
                  <Image src={feature.icon} alt={`${feature.title} Icon`} width={100} height={100} className={styles.featureIcon} unoptimized={feature.icon.endsWith('.gif')}/>
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What Happens Next Section */}
        <motion.section
          id="what-happens-next"
          className={styles.whatHappensNextSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} 
          variants={sectionVariants}
        >
          <div className={styles.whatHappensNextContent}>
            <h2 className={styles.whatHappensNextTitle}>What Happens Next?</h2>
            <div className={styles.whatHappensNextColumns}>
              <div className={styles.stepsContainer}>
                <motion.div className={styles.step} variants={sectionVariants}>
                  <div className={styles.stepNumber}>1</div>
                  <p className={styles.stepText}>Create your free account</p>
                </motion.div>
                <motion.div className={styles.step} variants={sectionVariants} custom={1}>
                  <div className={styles.stepNumber}>2</div>
                  <p className={styles.stepText}>Tell us about your business</p>
                </motion.div>
                 <motion.div className={styles.step} variants={sectionVariants} custom={2}>
                  <div className={styles.stepNumber}>3</div>
                  <p className={styles.stepText}>Let us do the work</p>
                </motion.div>
                <motion.div className={styles.step} variants={sectionVariants} custom={3}>
                  <div className={styles.stepNumber}>4</div>
                  <p className={styles.stepText}>Attend the right events</p>
                </motion.div>
              </div>
              <motion.div className={styles.testimonialContainer} variants={sectionVariants} custom={2}>
                <div className={styles.testimonialStars}>★★★★★</div>
                <p className={styles.testimonialText}>Hold poor organizers accountable. Do not get burned by bad events. Share your expereinces with others and help your network!</p>
                <p className={styles.testimonialAuthor}>– What all small business owners need</p>
              </motion.div>
              <motion.div className={styles.eventCard} variants={sectionVariants} custom={3}>
                <Image 
                  src="/images/bryantPark.jpg" 
                  alt="Featured Pop-Up Event"
                  width={350} 
                  height={200} 
                  className={styles.eventImage} 
                />
                <div className={styles.eventCardContent}>
                  <h3 className={styles.eventCardTitle}>Bryant Park Holiday Market</h3>
                  <p className={styles.eventCardLocation}>Manhattan, NY</p> 
                  <p className={styles.eventCardDate}>
                    <CalendarIcon />
                    Next Event: Sat, Jul 27
                  </p>
                </div>
                <div className={styles.dotsContainer}>
                  <span className={`${styles.dot} ${styles.dotActive}`}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Laptop Dashboard Image Section */}
        <motion.section
          className={`${styles.standardSectionContent} ${styles.laptopImageSection}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
           <h2 className={styles.sectionTitle}>All-In-One Vendor Dashboard</h2>
           <p className={styles.sectionSubtitle}>
              Manage applications, track finances, and get insights—all from one central hub designed for vendors like you.
          </p>
          <Image
            src="/images/laptopdash.png" 
            alt="MarkitIt dashboard on a laptop screen"
            width={1000} 
            height={600} 
            className={styles.laptopImage}
          />
        </motion.section>

        {/* Book a demo/ Join the newsletter section - RELOCATED & UPDATED with new Brevo HTML Embed */}
        <motion.section
          className={styles.newsletterSection} /* This class provides the dark blue background */
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <div className={styles.newsletterContent}> {/* This class centers content and sets max-width */}
            <h2 className={styles.newsletterTitle}>Get Early Access to MarkitIt</h2>
            <p className={styles.newsletterSubtitle}>
              We're building a platform that puts small businesses first. Sign up for early access or book a preview call to help shape MarkitIt before launch.
            </p>
            
            {/* START - New Simplified Brevo Form HTML converted to JSX */}
            <div className="sib-form" style={{ textAlign: 'center', backgroundColor: 'transparent' }}>
              <div id="sib-form-container" className="sib-form-container">
                {/* Re-adding Brevo's standard message panel containers */}
                <div id="error-message" className="sib-form-message-panel" style={{fontSize:'16px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'3px', borderColor:'#ff4949',maxWidth:'540px', margin: '10px auto', display: 'none' /* Initially hidden by Brevo script or CSS */}}>
                  <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                    <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                      <path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z" />
                    </svg>
                    <span className="sib-form-message-panel__inner-text">
                      {/* This text will be replaced by Brevo's actual error message */}
                    </span>
                  </div>
                </div>
                <div id="success-message" className="sib-form-message-panel" style={{fontSize:'16px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#085229', backgroundColor:'#e7faf0', borderRadius:'3px', borderColor:'#13ce66',maxWidth:'540px', margin: '10px auto', display: 'none' /* Initially hidden by Brevo script or CSS */}}>
                  <div className="sib-form-message-panel__text sib-form-message-panel__text--center">
                    <svg viewBox="0 0 512 512" className="sib-icon sib-notification__icon">
                      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248C504 119.083 392.957 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z" />
                    </svg>
                    <span className="sib-form-message-panel__inner-text">
                      {/* This text will be replaced by Brevo's actual success message */}
                    </span>
                  </div>
                </div>

                <div id="sib-container" className="sib-container--large sib-container--vertical" style={{textAlign:'center', backgroundColor:'transparent', maxWidth:'540px', borderRadius:'8px', borderWidth:'0px', direction:'ltr', margin:'0 auto'}}>
                  <form id="sib-form" method="POST" action="https://sibforms.com/serve/MUIFACYJpXVx46I1Mtb6N4kpoQAjOUIg1YGs2Z3sr7ocK_QoJBtSc9wfU7NpaNJqJ_id4xdywohqZIhR7-U28d6zjzEb7MNYFWKFOytgjC1xQeqMdCHXha2V9lBz9tYWRWj116XoPpA1N09DjVK6qEgSv-qZ0klenRuPYUcS-uMXmkaWBv5pjkJNkhdlDZ6Rzl4W6vwPugxojLKc" data-type="subscription">
                    <div style={{padding: '8px 0'}}>
                      <div className="sib-input sib-form-block">
                        <div className="form__entry entry_block">
                          <div className="form__label-row ">
                            <div className="entry__field">
                              <input className="input " type="text" id="EMAIL" name="EMAIL" autoComplete="off" placeholder="Enter your email address" data-required="true" required />
                            </div>
                          </div>
                          <label htmlFor="EMAIL" className="entry__error entry__error--primary" style={{fontSize:'16px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'3px', borderColor:'#ff4949'}}></label>
                          <label htmlFor="EMAIL" className="entry__specification" style={{fontSize:'12px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#ffffff'}}>
                            Subscribe and recieve MarkitIt access and updates. For e.g abc@xyz.com
                          </label>
                        </div>
                      </div>
                    </div>
                    <div style={{padding: '8px 0'}}>
                      <div className="sib-input sib-form-block">
                        <div className="form__entry entry_block">
                          <div className="form__label-row ">
                            <div className="entry__field">
                              <input className="input " maxLength={200} type="text" id="FIRSTNAME" name="FIRSTNAME" autoComplete="off" placeholder="Enter your first and last name" />
                            </div>
                          </div>
                          <label htmlFor="FIRSTNAME" className="entry__error entry__error--primary" style={{fontSize:'16px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'3px', borderColor:'#ff4949'}}></label>
                          {/* No entry__specification for FIRSTNAME in this version */}
                        </div>
                      </div>
                    </div>
                    <div style={{padding: '8px 0'}}>
                      <div className="sib-input sib-form-block">
                        <div className="form__entry entry_block">
                          <div className="form__label-row ">
                            <div className="entry__field">
                              <input className="input " maxLength={200} type="text" id="JOB_TITLE" name="JOB_TITLE" autoComplete="off" placeholder="Enter your business name" />
                            </div>
                          </div>
                          <label htmlFor="JOB_TITLE" className="entry__error entry__error--primary" style={{fontSize:'16px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'3px', borderColor:'#ff4949'}}></label>
                          <label htmlFor="JOB_TITLE" className="entry__specification" style={{fontSize:'12px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#ffffff'}}>
                            Please enter your full business name
                          </label>
                        </div>
                      </div>
                    </div>
                    <div style={{padding: '8px 0'}}>
                      <div className="sib-input sib-form-block">
                        <div className="form__entry entry_block">
                          <div className="form__label-row ">
                            <div className="entry__field">
                              <input className="input " maxLength={200} type="text" id="CONTACT_TIMEZONE" name="CONTACT_TIMEZONE" autoComplete="off" placeholder="Enter your city and state of business e.g Jersey City, NJ" />
                            </div>
                          </div>
                          <label htmlFor="CONTACT_TIMEZONE" className="entry__error entry__error--primary" style={{fontSize:'16px', textAlign:'left', fontFamily:'Helvetica, sans-serif', color:'#661d1d', backgroundColor:'#ffeded', borderRadius:'3px', borderColor:'#ff4949'}}></label>
                          {/* No entry__specification for CONTACT_TIMEZONE in this version */}
                        </div>
                      </div>
                    </div>
                    <div style={{padding: '8px 0'}}>
                      <div className="sib-form-block" style={{textAlign: 'center'}}>
                        <button className="sib-form-block__button sib-form-block__button-with-loader" style={{fontSize:'16px', textAlign:'center', fontFamily:'Helvetica, sans-serif', color:'#FFFFFF', backgroundColor:'#d84344', borderRadius:'11px', borderWidth:'0px'}} form="sib-form" type="submit">
                          <svg className="icon clickable__icon progress-indicator__icon sib-hide-loader-icon" viewBox="0 0 512 512">
                            <path d="M460.116 373.846l-20.823-12.022c-5.541-3.199-7.54-10.159-4.663-15.874 30.137-59.886 28.343-131.652-5.386-189.946-33.641-58.394-94.896-95.833-161.827-99.676C261.028 55.961 256 50.751 256 44.352V20.309c0-6.904 5.808-12.337 12.703-11.982 83.556 4.306 160.163 50.864 202.11 123.677 42.063 72.696 44.079 162.316 6.031 236.832-3.14 6.148-10.75 8.461-16.728 5.01z" />
                          </svg>
                          JOIN EARLY ACCESS
                        </button>
                      </div>
                    </div>
                    <input type="text" name="email_address_check" defaultValue="" className="input--hidden" />
                    <input type="hidden" name="locale" defaultValue="en" />
                    <input type="hidden" name="html_type" defaultValue="simple" />
                  </form>
                </div>
              </div>
            </div>
            {/* END - Brevo Form HTML */}

            <Link href="https://calendly.com/raheeq-markitit" passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <motion.button 
                  className={`${styles.button} ${styles.demoButtonSecondary}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginTop: '0.75rem' }} 
                >
                  BOOK A DEMO
                </motion.button>
              </a>
            </Link>
          </div>
        </motion.section>

        {/* How it Works Section */}
        <motion.section
          id="how-it-works"
          className={styles.standardSectionContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className={styles.sectionTitle}>Simple Steps to Success</h2>
          <p className={styles.sectionSubtitle}>
            Getting started with MarkitIt is easy. Follow these simple steps to connect with your next big opportunity.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            {[ 
              { title: "Sign Up Quickly", description: "Create your vendor profile in minutes. Tell us about your brand and your event preferences & needs."},
              { title: "Events Matched Effortlessly", description: "Skip the filters. We score events for you and surface only the best-fit matches — no wasted time, no wasted fees."},
              { title: "Apply with Ease", description: "Submit applications with your saved information. Track status and communicate with hosts directly."}
            ].map((step, index) => (
              <motion.div key={index} style={{ padding: '2rem', border: '1px solid var(--primary-coral)', borderRadius: '12px', backgroundColor: 'var(--secondary-light-pink)', textAlign: 'center'}} variants={sectionVariants}>
                <h4 style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-dark-blue)', marginBottom: '1rem'}}>{step.title}</h4>
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* NEW Comparison Table Section */}
        <motion.section
          className={`${styles.standardSectionContent} ${styles.competitorsSection}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
        >
          <h2 className={styles.sectionTitle}>How <span className={styles.textCoral}>MarkitIt</span> Compares to the Rest</h2>
          <div className={styles.comparisonTableContainer}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Key Features & Focus</th>
                  <th>MarkitIt</th>
                  <th>Eventeny</th>
                  <th>Zapplication</th>
                  <th>EventHub</th>
                  <th>IG/FB (Socials)</th>
                  <th>Host Sites</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aggregates opportunities</td>
                  <td><span className={styles.checkIcon}>✅</span> Across 1,000s of sources</td>
                  <td><span className={styles.crossIcon}>❌</span> Organizer uploads only</td>
                  <td><span className={styles.crossIcon}>❌</span> Limited art fairs only</td>
                  <td><span className={styles.crossIcon}>❌</span> Organizer uploads only</td>
                  <td><span className={styles.crossIcon}>❌</span> Manual discovery</td>
                  <td><span className={styles.crossIcon}>❌</span> One site at a time</td>
                </tr>
                <tr>
                  <td>Vendor-first platform</td>
                  <td><span className={styles.checkIcon}>✅</span> Built for small biz sellers</td>
                  <td><span className={styles.crossIcon}>❌</span> Organizer-focused</td>
                  <td><span className={styles.crossIcon}>❌</span> Artist jury-only</td>
                  <td><span className={styles.crossIcon}>❌</span> Event logistics tool</td>
                  <td><span className={styles.crossIcon}>❌</span> General social apps</td>
                  <td><span className={styles.crossIcon}>❌</span> Organizer-focused</td>
                </tr>
                <tr>
                  <td>Host reviews & ratings</td>
                  <td><span className={styles.checkIcon}>✅</span> Transparent vendor feedback</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                </tr>
                <tr>
                  <td>Detailed event info</td>
                  <td><span className={styles.checkIcon}>✅</span> Fees, audience, vibe, policies</td>
                  <td><span className={styles.checkIcon}>✅</span> Basic info</td>
                  <td><span className={styles.checkIcon}>✅</span> Application details</td>
                  <td><span className={styles.checkIcon}>✅</span> Schedules & logistics</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span> Inconsistent</td>
                </tr>
                <tr>
                  <td>Direct contact with hosts</td>
                  <td><span className={styles.checkIcon}>✅</span> Contact options on every match</td>
                  <td><span className={styles.checkIcon}>✅</span> Internal messaging</td>
                  <td><span className={styles.checkIcon}>✅</span> via profile</td>
                  <td><span className={styles.checkIcon}>✅</span> Internal messaging</td>
                  <td><span className={styles.checkIcon}>✅</span> DMs only</td>
                  <td><span className={styles.checkIcon}>✅</span> Email (if listed)</td>
                </tr>
                <tr>
                  <td>1-click applications</td>
                  <td><span className={styles.checkIcon}>✅</span> Autofill & apply in seconds</td>
                  <td><span className={styles.crossIcon}>❌</span> Manual forms</td>
                  <td><span className={styles.crossIcon}>❌</span> Jury applications</td>
                  <td><span className={styles.crossIcon}>❌</span> Manual</td>
                  <td><span className={styles.crossIcon}>❌</span> No apply feature</td>
                  <td><span className={styles.checkIcon}>✅</span> Fast but repetitive</td>
                </tr>
                <tr>
                  <td>Reminders & automation</td>
                  <td><span className={styles.checkIcon}>✅</span> App deadlines, alerts, follow-ups</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                </tr>
                <tr>
                  <td>Two-way & group messaging</td>
                  <td><span className={styles.checkIcon}>✅</span> DM + group chats with hosts/vendors</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.checkIcon}>✅</span> DMs only</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                </tr>
                <tr>
                  <td>Public vendor profiles</td>
                  <td><span className={styles.checkIcon}>✅</span> Showcase your brand, apply faster</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                  <td><span className={styles.checkIcon}>✅</span> Bio only</td>
                  <td><span className={styles.crossIcon}>❌</span></td>
                </tr>
                <tr>
                  <td>Pop-up focused events</td>
                  <td><span className={styles.checkIcon}>✅</span> Designed for markets & mobile retail</td>
                  <td><span className={styles.crossIcon}>❌</span> All event types</td>
                  <td><span className={styles.crossIcon}>❌</span> Juried art fairs</td>
                  <td><span className={styles.crossIcon}>❌</span> Conferences/logistics</td>
                  <td><span className={styles.crossIcon}>❌</span> Mixed content</td>
                  <td><span className={styles.checkIcon}>✅</span> Sometimes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
      <Script strategy="lazyOnload" src="https://sibforms.com/forms/end-form/build/main.js" />
    </>
  );
}

// Extend the Window interface for custom properties
declare global {
  interface Window {
    REQUIRED_CODE_ERROR_MESSAGE?: string;
    LOCALE?: string;
    EMAIL_INVALID_MESSAGE?: string;
    SMS_INVALID_MESSAGE?: string;
    REQUIRED_ERROR_MESSAGE?: string;
    GENERIC_INVALID_MESSAGE?: string;
    translation?: any;
    AUTOHIDE?: boolean;
  }
}

