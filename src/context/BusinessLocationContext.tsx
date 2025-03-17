"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface BusinessLocationContextProps {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  manualLocation: string;
  setManualLocation: React.Dispatch<React.SetStateAction<string>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  travelPreference: string;
  setTravelPreference: React.Dispatch<React.SetStateAction<string>>;
}

const BusinessLocationContext = createContext<BusinessLocationContextProps | undefined>(undefined);

export const BusinessLocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location>({ lat: 40.7128, lng: -74.006 }); // Default to NYC
  const [manualLocation, setManualLocation] = useState<string>('');
  const [radius, setRadius] = useState<number>(50); // Default 50 mile radius
  const [travelPreference, setTravelPreference] = useState<string>('Only in my city');

  return (
    <BusinessLocationContext.Provider value={{
      location,
      setLocation,
      manualLocation,
      setManualLocation,
      radius,
      setRadius,
      travelPreference,
      setTravelPreference
    }}>
      {children}
    </BusinessLocationContext.Provider>
  );
};

export const useBusinessLocationContext = () => {
  const context = useContext(BusinessLocationContext);
  if (!context) {
    throw new Error('useBusinessLocationContext must be used within a BusinessLocationProvider');
  }
  return context;
};
