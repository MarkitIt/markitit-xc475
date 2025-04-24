"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Adjust the import based on your project structure
import styles from "./styles.module.css";

const VendorDashboard = () => {
  const [userName, setUserName] = useState<string | null>(null); // State to store the user's name

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        console.log("User UID:", user.uid); // Log the user's UID
        setUserName(user.email); // Set the user's display name
        console.log("User object:", user); // Log the entire user object
      } else {
        // No user is signed in
        console.log("No user is signed in.");
        setUserName(null); // Reset the user name
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <main className="global-background">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {userName
              ? `Welcome to your dashboard, ${userName}!`
              : "Please sign in."}
          </h2>
          <p className={styles.subtitle}>
            Here you can manage your vendor profile, view applications, and
            more.
          </p>
        </div>
        <nav className={styles.navigation}>
          {/* Navigation links can go here */}
        </nav>
      </div>
    </main>
  );
};

export default VendorDashboard;
