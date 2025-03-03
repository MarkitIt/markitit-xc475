"use client"


import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessPastPopupContextProps {
  selectedPastPopups: string[];
  setSelectedPastPopups: React.Dispatch<React.SetStateAction<string[]>>;
}

const BusinessPastPopupContext = createContext<BusinessPastPopupContextProps | undefined>(undefined);

export const BusinessPastPopupProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPastPopups, setSelectedPastPopups] = useState<string[]>([]);

  return (
    <BusinessPastPopupContext.Provider value={{ selectedPastPopups, setSelectedPastPopups }}>
      {children}
    </BusinessPastPopupContext.Provider>
  );
};

export const useBusinessPastPopupContext = () => {
  const context = useContext(BusinessPastPopupContext);
  if (!context) {
    throw new Error('useBusinessPastPopupContext must be used within a BusinessPastPopupProvider');
  }
  return context;
};