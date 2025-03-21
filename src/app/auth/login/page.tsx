"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";

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
      router.push("/");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-screen h-screen flex">
      {/* Left Section - Welcome Message */}
      <div className="w-[40%] h-full bg-[#1f555c] flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold">Welcome Back!</h1>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex flex-col items-center justify-center w-[60%]">
        <h2 className="text-2xl font-extrabold tracking-wide text-black">LOG IN</h2>

        {/* Signup Link */}
        <p className="mt-2 text-sm text-black">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[#f15152] font-bold">
            Sign up here.
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
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Login Button */}
        <button 
          onClick={handleLogin} 
          className="mt-6 w-[404px] h-[47px] bg-[#f15152] text-white text-xl font-bold rounded-[10px] hover:bg-[#d43f40]"
        >
          LOGIN
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
