"use client";

import styles from './aboutus.module.css';

export default function AboutUs() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Our Story</h1>
        <p className={styles.paragraph}>
          MarkitIt was founded by two first-generation Sudanese American women and lifelong family friends whose families have shared a close bond for over two decades. More than co-founders, they are deeply rooted collaborators—united by trust, shared values, cultural resilience, and a commitment to building something impactful for their community.
        </p>
        <p className={styles.paragraph}>
          The idea for MarkitIt was born from lived experience and a moment of shared frustration. One founder, a small business owner with a background in consulting, project management, and implementation, was overwhelmed by the exhausting process of finding and applying to pop-up markets. Her days were consumed by spreadsheets, scattered websites, social media threads, word-of-mouth tips, and dozens of open Chrome tabs. The process was chaotic, inefficient, and draining valuable time she could have spent growing her business.
        </p>
        <p className={styles.paragraph}>
          She turned to her close friend, a computer science student at the time, for support. As they talked, it became clear that this wasn't just a personal pain point—it was a widespread gap in the small business ecosystem. There was no centralized, trusted, or purpose-built platform to help small businesses find high-quality pop-up markets or manage the application process with ease. What started as a venting session quickly turned into a shared vision.
        </p>
        <p className={styles.paragraph}>
          Together, they combined their strengths: one with technical skill and software development expertise, the other with firsthand small business experience and a deep understanding of operations, implementation, and client relationships. From that collaboration, MarkitIt was born—a platform designed specifically to support small businesses in navigating and succeeding within the pop-up market space.
        </p>
        <p className={styles.paragraph}>
          MarkitIt is more than a tool—it's a movement. A labor of lived experience, legacy, and bold action. We are building the infrastructure small businesses have long needed: a streamlined, supportive platform that saves time, reduces overwhelm, and opens doors to visibility, opportunity, and growth.
        </p>
        <p className={styles.paragraph}>
          We're proud to lead this change as two women of color in tech and entrepreneurship, reshaping how small businesses show up and thrive in an ecosystem that too often overlooks them.
        </p>
      </div>
    </main>
  );
}