import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import '../tailwind.css';

const BusinessAdjective = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center p-6 border-b bg-white shadow-sm">
        <h1 className="text-4xl font-bold">Markitit</h1>
        <nav className="flex space-x-12">
          <a href="#" className="text-gray-600 text-lg">Ipsum</a>
          <a href="#" className="text-gray-600 text-lg">Ipsum</a>
          <a href="#" className="text-gray-600 text-lg">Ipsum</a>
        </nav>
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 text-xl">🔍</button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-lg">Profile</span>
            <button className="text-gray-600 text-lg">▼</button>
          </div>
        </div>
      </header>

      <main className="p-16 flex space-x-16">
        <div className="w-[40%] h-[450px] bg-gray-300 rounded-lg"></div>
        <div className="w-[60%]">
          <h2 className="text-md text-gray-500">Step 02/05</h2>
          <h1 className="text-5xl font-bold mb-8">Which adjectives describe your business the best?</h1>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="h-12 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          <div className="flex space-x-6 mt-8">
            <div className="w-36 h-14 bg-gray-300 rounded-lg"></div>
            <div className="w-48 h-14 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessAdjective;
