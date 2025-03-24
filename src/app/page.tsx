"use client";

import Link from "next/link";
import "./tailwind.css";
    

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-black">Pop Up. Stand Out. Sell More.</h1>
        <p className="text-lg text-gray-700 mt-4">
          We simplify the pop-up process for small businesses and vendors by providing a 
          one-stop platform for finding top-tier events, managing applications, and connecting 
          with a thriving vendor community.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="flex justify-center space-x-6 mt-10">
        <div className="w-48 h-40 flex items-center justify-center bg-[#1f555c] text-white font-semibold rounded-lg text-center">
          Streamline applications.
        </div>
        <div className="w-48 h-40 flex items-center justify-center bg-[#1f555c] text-white font-semibold rounded-lg text-center">
          Discover opportunities.
        </div>
        <div className="w-48 h-40 flex items-center justify-center bg-[#1f555c] text-white font-semibold rounded-lg text-center">
          Maximize your sales.
        </div>
      </div>

      {/* Call-to-Action Button */}
      <Link href="/events">
        <button className="mt-10 px-6 py-3 bg-[#f15152] text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition">
          Explore Events Now
        </button>
      </Link>

      {/* Footer */}
      <p className="mt-8 text-gray-600">Join Markitit and make every pop-up count!</p>
    </div>
  );
}
