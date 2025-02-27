import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from 'next/router';
import './tailwind.css';

const Header = () => {
  return (
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
  );
};

export default Header;