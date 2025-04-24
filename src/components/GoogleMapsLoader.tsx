"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import LoadScript to disable SSR
const LoadScript = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.LoadScript),
  { ssr: false },
);

const libraries = "places";

// Global variable to track if the Google Maps API is already loaded
let isGoogleMapsAPILoaded = false;

export default function GoogleMapsLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isGoogleMapsAPILoaded) {
      // If the API is already loaded, set the state to loaded
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    isGoogleMapsAPILoaded = true; // Mark the API as loaded
    setIsLoaded(true);
  };

  return (
    <>
      {!isGoogleMapsAPILoaded && (
        <LoadScript
          id="google-maps-script"
          googleMapsApiKey={`${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`}
          libraries={[libraries]}
          onLoad={handleLoad}
        >
          {isLoaded ? children : <p>Loading Google Maps...</p>}
        </LoadScript>
      )}
      {isGoogleMapsAPILoaded && isLoaded && children}
    </>
  );
}
