"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/firebase"; // Ensure this path is correct
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useUserContext } from '../../../context/UserContext';
import { auth} from '../../../lib/firebase';

import { onAuthStateChanged, User} from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { getVendorProfile } = useUserContext();
  const [user, setUser] = useState<User | null>(null);


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
