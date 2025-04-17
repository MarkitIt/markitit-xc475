"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

// Dynamic import of MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

const LocationPreferences = () => {
  const router = useRouter();

  // State for user location
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC
  const [manualLocation, setManualLocation] = useState("");
  const [radius, setRadius] = useState(50); // Default travel radius in miles
  const [travelPreference, setTravelPreference] = useState("Only in my city");

  // Convert miles to meters (for Leaflet circle)
  const radiusInMeters = radius * 1609.34;

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log("Geolocation not allowed, using manual input"),
      );
    }
  }, []);

  const handleNextStepClick = () => {
    router.push("/create-profile/vendor/businessBudget");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col lg:flex-row">
      {/* Left Side: Form Inputs */}
      <div className="lg:w-1/2 p-8">
        <h1 className="text-3xl font-bold mb-4">Set Your Location Preferences</h1>
        
        {/* Manual Location Input */}
        <label className="block text-lg font-semibold">Enter Your Location:</label>
        <input
          type="text"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          placeholder="City, State or ZIP Code"
          className="w-full p-2 border border-gray-300 rounded mt-2"
        />

        {/* Travel Preference Dropdown */}
        <label className="block text-lg font-semibold mt-4">Are you willing to travel?</label>
        <select
          value={travelPreference}
          onChange={(e) => setTravelPreference(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
        >
          <option>Only in my city</option>
          <option>Only in my state</option>
          <option>I have no preference</option>
        </select>

        {/* Travel Distance Slider */}
        <label className="block text-lg font-semibold mt-4">How far are you willing to travel?</label>
        <input
          type="range"
          min="3"
          max="3000"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value))}
          className="w-full mt-2"
        />
        <p className="text-gray-600">Up to {radius} miles</p>

        {/* Next Step Button */}
        <button
          onClick={handleNextStepClick}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next Step
        </button>
      </div>

      {/* Right Side: Interactive Map */}
      <div className="lg:w-1/2 h-[500px] lg:h-screen p-4">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={8}
          className="h-full w-full rounded-lg shadow-lg"
        >
          {/* Map Tile Layer */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* User Location Marker */}
          <Marker position={[location.lat, location.lng]} />

          {/* Dynamic Travel Radius Circle */}
          <Circle
            center={[location.lat, location.lng]}
            radius={radiusInMeters} // Convert miles to meters
            pathOptions={{ color: "blue", fillOpacity: 0.2 }}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPreferences;
