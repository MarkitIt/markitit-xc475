"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        uid: user.uid,
      });

      alert("Account created successfully!");
      router.push("/auth/login"); // Redirect to login page
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left Section - Welcome Message */}
      <div className="w-[40%] h-full bg-[#1f555c] flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold">Join us!</h1>
      </div>

      {/* Right Section - Signup Form */}
      <div className="flex flex-col items-center justify-center w-[60%]">
        <h2 className="text-2xl font-extrabold tracking-wide text-black">SIGN UP</h2>

        {/* Login Redirect */}
        <p className="mt-2 text-sm text-black">
          Create a Markitit account. Already have one?{" "}
          <Link href="/auth/login" className="text-[#f15152] font-bold">
            Log in.
          </Link>
        </p>

        {/* Email Field */}
        <div className="mt-6 w-[404px]">
          <label className="block text-xl font-normal text-black tracking-wide">Email Address</label>
          <input
            type="email"
            className="w-full h-[47px] mt-1 px-4 border border-black rounded-[10px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mt-6 w-[404px]">
          <label className="block text-xl font-normal text-black tracking-wide">Password</label>
          <input
            type="password"
            className="w-full h-[47px] mt-1 px-4 border border-black rounded-[10px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>

        {/* First & Last Name Fields */}
        <div className="mt-6 flex gap-4 w-[404px]">
          <div className="w-[50%]">
            <label className="block text-xl font-normal text-black tracking-wide">First Name</label>
            <input
              type="text"
              className="w-full h-[47px] mt-1 px-4 border border-black rounded-[10px]"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
          </div>
          <div className="w-[50%]">
            <label className="block text-xl font-normal text-black tracking-wide">Last Name</label>
            <input
              type="text"
              className="w-full h-[47px] mt-1 px-4 border border-black rounded-[10px]"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignUp}
          className="mt-6 w-[404px] h-[47px] bg-[#f15152] text-white text-xl font-bold rounded-[10px] hover:bg-[#d43f40]"
        >
          SIGN UP
        </button>

        {/* OR Divider */}
        <div className="relative flex items-center w-[404px] mt-6">
          <div className="flex-grow border-t border-black border-opacity-70"></div>
          <span className="px-4 text-xl text-black text-opacity-70">OR</span>
          <div className="flex-grow border-t border-black border-opacity-70"></div>
        </div>

        {/* Social Logins */}
        <div className="flex gap-6 mt-6">
          {/* Facebook */}
          <div className="w-[53px] h-[53px] bg-[#0866ff] rounded-full flex items-center justify-center">
            <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
          </div>

          {/* Google */}
          <div className="w-[53px] h-[53px] border border-black rounded-full flex items-center justify-center">
            <Image src="/icons/google.png" alt="Google" width={24} height={24} />
          </div>

          {/* Apple */}
          <div className="w-[53px] h-[53px] border border-black rounded-full flex items-center justify-center">
            <Image src="/icons/apple.png" alt="Apple" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
