"use client";

import React, { useState } from 'react';
import '../tailwind.css';

const VendorDashboard = () => {
  const [userInput, setUserInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setChatResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userInput }),
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
            <div className="p-4 bg-[#3a2e39] text-white rounded-[10px] border border-black">
              <div>Sip & Shop</div>
              <div>Date: Saturday, March 22</div>
              <div>Time: 12:00PM - 5:00PM</div>
              <div>Place: Time Out Market, Boston</div>
            </div>
            <div className="p-4 bg-[#3a2e39] text-white rounded-[10px] border border-black">
              <div>FiberFest</div>
              <div>Date: Sunday, March 23</div>
              <div>Time: 10:00AM - 12:00PM</div>
              <div>Place: Boston Public Market</div>
            </div>
            <div className="p-4 bg-[#3a2e39] text-white rounded-[10px] border border-black">
              <div>Int. Woman’s Day Market</div>
              <div>Date: Sunday, March 30</div>
              <div>Time: 12:00PM - 5:00PM</div>
              <div>Place: Time Out Market, Boston</div>
            </div>
            <div className="p-4 bg-[#3a2e39] text-white rounded-[10px] border border-black">
              <div>Not-a-Normal Market</div>
              <div>Date: Saturday, March 15</div>
              <div>Time: 8:00AM - 12:00PM</div>
              <div>Place: 660 Madison Avenue, New York</div>
            </div>
          </div>
        </div>

        {/* Financial Assistant (Chatbot) */}
        <div className="p-4 bg-neutral-200/20 rounded-[10px] border border-black">
          <div className="text-[#3a2e39] text-xl font-bold mb-2">Financial Assistant</div>
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
            <div>Mon</div>
            <div>Tues</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
        </div>

        {/* Application Status */}
        <div className="p-4 bg-neutral-200/20 rounded-[10px] border border-black">
          <div className="text-[#3a2e39] text-xl font-bold mb-2">Application Status</div>
          <div className="p-2 border border-black rounded mb-1">Hear Here - LLC Pop-Up Markets <span className="text-red-500">Declined</span></div>
          <div className="p-2 border border-black rounded mb-1">Sip & Shop - Time Out Market <span className="text-green-500">Accepted</span></div>
          <div className="p-2 border border-black rounded mb-1">FiberFest - Boston Public Market <span className="text-green-500">Accepted</span></div>
          <div className="p-2 border border-black rounded mb-1">Boston’s Women’s Market <span className="text-yellow-500">Pending</span></div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
