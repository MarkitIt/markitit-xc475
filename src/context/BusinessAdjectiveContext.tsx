"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessAdjectiveContextProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  vendorType: string | null;
  setVendorType: React.Dispatch<React.SetStateAction<string | null>>;
}

const BusinessAdjectiveContext = createContext<BusinessAdjectiveContextProps | undefined>(undefined);

export const BusinessAdjectiveProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [vendorType, setVendorType] = useState<string | null>(null);

  return (
    <BusinessAdjectiveContext.Provider value={{ selectedCategories, setSelectedCategories, vendorType, setVendorType }}>
      {children}
    </BusinessAdjectiveContext.Provider>
  );
};

export const useBusinessAdjectiveContext = () => {
  const context = useContext(BusinessAdjectiveContext);
  if (!context) {
    throw new Error('useBusinessAdjectiveContext must be used within a BusinessAdjectiveProvider');
  }
  return context;
};