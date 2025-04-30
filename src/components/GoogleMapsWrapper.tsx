// components/GoogleMapsWrapper.tsx
"use client";

import { ReactNode } from "react";
import { LoadScript, useJsApiLoader } from "@react-google-maps/api";

interface GoogleMapsWrapperProps {
  children: ReactNode;
}

export default function GoogleMapsWrapper({ children }: GoogleMapsWrapperProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return <>{children}</>;
}
