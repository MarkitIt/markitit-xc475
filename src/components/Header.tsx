"use client";

import React from "react";
import Link from "next/link";
import "./tailwind.css";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-10 py-4 border-b border-black w-full bg-white">
      {/* Left Section: Logo */}
      <Link href="/" className="w-[160px] h-[40px]">
      <img src="/images/logo.png" alt="Markitit Logo" className="h-10 w-auto" />
      </Link>

      {/* Right Section: Navigation Buttons */}
      <nav className="flex space-x-4">
        <Link
          href="/"
          className="w-[70px] h-[40px] flex items-center justify-center text-black text-lg font-normal font-['Manrope'] border border-black rounded-[14px] hover:bg-gray-100 transition"
        >
          Home
        </Link>
        <Link
          href="/community"
          className="w-[110px] h-[40px] flex items-center justify-center text-black text-lg font-normal font-['Manrope'] border border-black rounded-[14px] hover:bg-gray-100 transition"
        >
          Community
        </Link>
        <Link
          href="/notifications"
          className="w-[125px] h-[40px] flex items-center justify-center text-black text-lg font-normal font-['Manrope'] border border-black rounded-[14px] hover:bg-gray-100 transition"
        >
          Notifications
        </Link>
        <Link
          href="/auth/login"
          className="w-[140px] h-[40px] flex items-center justify-center text-black text-lg font-normal font-['Manrope'] border border-black rounded-[14px] hover:bg-gray-100 transition"
        >
          Signup/ Log in
        </Link>
      </nav>
    </header>
  );
};

export default Header;
