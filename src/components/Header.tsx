'use client';

import { signOut } from "firebase/auth";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useHostContext } from '../context/HostContext';
import { useUserContext } from '../context/UserContext';
import { auth } from "../lib/firebase";
import './tailwind.css';

const Header: React.FC = () => {
  const { user, vendorProfile, getVendorProfile } = useUserContext();
  const { hostProfile, setHostProfile } = useHostContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      getVendorProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateHostTrue = () => {
    setHostProfile(true); // Set the user as a host
  };

  const updateHostFalse = () => {
    setHostProfile(false); // Set the user as a vendor
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200); // Short delay to prevent flickering
  };

  const renderProfileOptions = () => {
    if (!user) {
      return (
        <>
          <Link href="/auth/login" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            Log in
          </Link>
          <Link href="/auth/signup" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            Sign up
          </Link>
        </>
      );
    }

    if (hostProfile) {
      return (
        <>
          <Link href="/" onClick={updateHostFalse} className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            Become a vendor
          </Link>
          <Link href="/vendor-dashboard" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            Vendor Dashboard
          </Link>
          <Link href="/application/host" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            My Applications
          </Link>
          <Link href="/create-event" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            Create Event
          </Link>
          <Link href="/settings" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
            Settings
          </Link>
          <button onClick={handleLogout} className="block text-lg font-normal text-red-600 px-4 py-2 hover:bg-gray-100 rounded">
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <Link href="/" onClick={updateHostTrue} className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
          Become a host
        </Link>
        <Link href={vendorProfile ? "/vendor-dashboard" : "/vendor-profile"} className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
          {vendorProfile ? "Dashboard" : "Create Profile"}
        </Link>
        <Link href="/application/vendor" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
          My Applications
        </Link>
        <Link href="/settings" className="block text-lg font-normal text-black px-4 py-2 hover:bg-gray-100 rounded">
          Settings
        </Link>
        <button onClick={handleLogout} className="block text-lg font-normal text-red-600 px-4 py-2 hover:bg-gray-100 rounded">
          Logout
        </button>
      </>
    );
  };

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

        {/* Signup/ Log in Dropdown */}
        <div
          className="relative w-[140px] h-[40px] flex items-center justify-center border border-black rounded-[14px] hover:bg-gray-100 transition cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="text-black text-lg font-normal font-['Manrope']">Signup/ Log in</span>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-[190px] bg-white border border-black rounded-[14px] shadow-md p-2 flex flex-col space-y-2"
              onMouseEnter={handleMouseEnter} // Keep it open when hovering over dropdown
              onMouseLeave={handleMouseLeave} // Delayed close
            >
              {renderProfileOptions()}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;