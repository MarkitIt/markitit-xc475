"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Location {
  city: string;
  state: string;
}

interface ApplicationProfileContextProps {
  category: string[];
  setCategory: (category: string[]) => void;
  date: string;
  setDate: (date: string) => void;
  description: string;
  setDescription: (description: string) => void;
  event_id: string;
  setEventId: (id: string) => void;
  event_unique_id: string;
  setEventUniqueId: (uniqueId: string) => void;
  location: Location;
  setLocation: (location: Location) => void;
  name: string;
  setName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  vendor_id: string;
  setVendorId: (vendorId: string) => void;
}

const ApplicationProfileContext = createContext<ApplicationProfileContextProps | undefined>(undefined);

export const ApplicationProfileProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [event_id, setEventId] = useState<string>("");
  const [event_unique_id, setEventUniqueId] = useState<string>("");
  const [location, setLocation] = useState<Location>({ city: "", state: "" });
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [vendor_id, setVendorId] = useState<string>("");

  return (
    <ApplicationProfileContext.Provider value={{
      category, setCategory,
      date, setDate,
      description, setDescription,
      event_id, setEventId,
      event_unique_id, setEventUniqueId,
      location, setLocation,
      name, setName,
      price, setPrice,
      vendor_id, setVendorId
    }}>
      {children}
    </ApplicationProfileContext.Provider>
  );
};

export const useApplicationProfileContext = () => {
  const context = useContext(ApplicationProfileContext);
  if (!context) {
    throw new Error('useApplicationProfileContext must be used within an ApplicationProfileProvider');
  }
  return context;
};