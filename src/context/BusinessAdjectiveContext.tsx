"use client"


import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessAdjectiveContextProps {
  selectedAdjectives: string[];
  setSelectedAdjectives: React.Dispatch<React.SetStateAction<string[]>>;
}

const BusinessAdjectiveContext = createContext<BusinessAdjectiveContextProps | undefined>(undefined);

export const BusinessAdjectiveProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([]);

  return (
    <BusinessAdjectiveContext.Provider value={{ selectedAdjectives, setSelectedAdjectives }}>
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