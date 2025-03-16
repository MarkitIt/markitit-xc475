"use client";

import { useState } from "react";
import { signUpUser } from "@/lib/firebase"; // Ensure this path is correct
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUpUser(email, password);
      alert("User signed up successfully!");
      router.push("/auth/login"); // Redirect to login page after signup
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Side - Form */}
        <div className={styles.formSection}>
          <h1>Sign up</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Create a Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
            </div>

            <button type="submit">Sign up</button>
          </form>
          <p className={styles.link}>
            Already have an account? <a href="/auth/login">Log in here.</a>
          </p>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className={styles.imageSection}>Image Placeholder</div>
      </div>
    </div>
  );
}
