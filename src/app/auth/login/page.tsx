"use client";

import { useState } from "react";
import { loginUser } from "@/lib/firebase"; // Ensure this path is correct
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      alert("User logged in successfully!");
      router.push("/"); // Redirect to home page after login
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Left Side - Form */}
        <div className={styles.formSection}>
          <h1>Log in</h1>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>

            <button type="submit">Log in</button>
          </form>
          <p className={styles.link}>
            Don't have an account? <a href="/auth/signup">Sign up here.</a>
          </p>
        </div>

        {/* Right Side - Image Placeholder */}
        <div className={styles.imageSection}>Image Placeholder</div>
      </div>
    </div>
  );
}
