"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import styles from '../auth.module.css';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { getVendorProfile } = useUserContext();
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/search-events');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <Image
          src="/images/mLogo.png"
          alt="Markitit Shortened Logo"
          width={200}
          height={100}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
        <h1 className={styles.welcomeText}>Welcome<br/>Back!</h1>
      </div>
      
      <div className={styles.rightPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>LOG IN</h2>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            LOGIN
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialButton}>
              <Image
                src="/images/facebookLogo.png"
                alt="Facebook Logo"
                width={100}
                height={50}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </button>
            <button type="button" className={styles.socialButton}>
              <Image
                src="/images/googleLogo.png"
                alt="Google Logo"
                width={20}
                height={10}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </button>
            <button type="button" className={styles.socialButton}>
              <Image
                src="/images/appleLogo.png"
                alt="Apple Logo"
                width={20}
                height={10}
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </button>
          </div>

          <div className={styles.authText}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className={styles.authLink}>
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
