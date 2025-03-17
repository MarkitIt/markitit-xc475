"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessScheduleContextProps {
  preferredDays: string[];
  setPreferredDays: React.Dispatch<React.SetStateAction<string[]>>;
  eveningMarketPreference: string;
  setEveningMarketPreference: React.Dispatch<React.SetStateAction<string>>;
}

const BusinessScheduleContext = createContext<BusinessScheduleContextProps | undefined>(undefined);

export const BusinessScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [eveningMarketPreference, setEveningMarketPreference] = useState<string>('');

  return (
    <BusinessScheduleContext.Provider value={{ 
      preferredDays, 
      setPreferredDays, 
      eveningMarketPreference, 
      setEveningMarketPreference 
    }}>
      {children}
    </BusinessScheduleContext.Provider>
  );
};

export const useBusinessScheduleContext = () => {
  const context = useContext(BusinessScheduleContext);
  if (!context) {
    throw new Error('useBusinessScheduleContext must be used within a BusinessScheduleProvider');
  }
  return context;
};
