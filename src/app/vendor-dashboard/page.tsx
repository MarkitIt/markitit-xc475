"use client";

import React, { useState } from 'react';
import '../tailwind.css';

const VendorDashboard = () => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const dummyVendorData = {
    businessName: "Candle Kingdom",
    city: "Boston",
    travelPreference: "Only in my city",
    travelRadius: 25,
    budget: {
      maxApplicationFee: 50,
      maxVendorFee: 200,
    },
    description: "Handmade soy wax candles in glass jars.",
  };

  const handleSubmit = async () => {
    setLoading(true);
    setChatResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userInput, vendorData: dummyVendorData }),
      });

      const data = await res.json();
      setChatResponse(data.answer);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      setChatResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative bg-white overflow-auto p-4 grid grid-cols-4 gap-4">
      {/* Sidebar */}
      <div className="col-span-1 p-4 bg-[#3a2e39] rounded-[10px] border border-black">
        <img className="w-[124px] h-[124px] rounded-full mb-4" src="https://placehold.co/124x124" alt="Profile" />
        <div className="text-white text-xl font-semibold">Sara Johnson</div>
        <div className="text-white text-sm font-medium">Candle Shop Owner</div>
        <div className="text-white text-sm">Boston, MA</div>
        <div className="mt-4 text-black bg-white rounded-[30px] p-4">
          <div>Upcoming Events</div>
          <div>My Applications</div>
          <div>Financial Overview</div>
          <div>Feed</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-3 grid grid-cols-3 gap-4">
        {/* Your Pop-Ups in March */}
        <div className="col-span-2">
          <div className="text-[#3a2e39] text-xl font-bold mb-2">Your Pop-Ups in March</div>
          <div className="grid grid-cols-2 gap-4">
            {["Sip & Shop", "FiberFest", "Int. Woman’s Day Market", "Not-a-Normal Market"].map((name, i) => (
              <div key={i} className="p-4 bg-[#3a2e39] text-white rounded-[10px] border border-black">
                <div>{name}</div>
                <div>Date: Placeholder</div>
                <div>Time: Placeholder</div>
                <div>Place: Placeholder</div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Assistant */}
        <div className="p-4 bg-neutral-200/20 rounded-[10px] border border-black">
          <div className="text-[#3a2e39] text-xl font-bold mb-2">Financial Assistant</div>

          {/* Prewritten questions */}
          <div className="mb-2 flex gap-2 flex-wrap">
            {[
              "What's a good budget for a local event?",
              "Can I afford a $75 vendor fee?",
              "How should I choose between two events?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setUserInput(q)}
                className="bg-gray-200 text-sm text-black px-3 py-1 rounded hover:bg-gray-300"
              >
                {q}
              </button>
            ))}
          </div>

          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about travel or food costs..."
            className="w-full h-24 p-2 border border-gray-300 rounded mb-2 bg-white text-black"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-[#3a2e39] text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Calculating..." : "Submit"}
          </button>
          {chatResponse && (
            <div className="mt-2 text-black bg-white p-2 rounded">
              {chatResponse}
            </div>
          )}
        </div>

        {/* Event Calendar */}
        <div className="col-span-2 p-4 bg-neutral-200/20 rounded-[10px] border border-black">
          <div className="text-[#3a2e39] text-xl font-bold mb-2">Event Calendar</div>
          <div className="mt-2">March 2025</div>
          <div className="grid grid-cols-7 gap-2">
            <div>Mon</div><div>Tues</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>
        </div>

        {/* Application Status */}
        <div className="p-4 bg-neutral-200/20 rounded-[10px] border border-black">
          <div className="text-[#3a2e39] text-xl font-bold mb-2">Application Status</div>
          {[
            { name: "Hear Here", status: "Declined", color: "red" },
            { name: "Sip & Shop", status: "Accepted", color: "green" },
            { name: "FiberFest", status: "Accepted", color: "green" },
            { name: "Boston’s Women’s Market", status: "Pending", color: "yellow" },
          ].map((app, i) => (
            <div key={i} className="p-2 border border-black rounded mb-1">
              {app.name} - Status: <span className={`text-${app.color}-500`}>{app.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
