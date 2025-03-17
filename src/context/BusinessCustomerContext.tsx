"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessCustomerContextProps {
  idealCustomer: string;
  setIdealCustomer: React.Dispatch<React.SetStateAction<string>>;
  eventPreference: string[];
  setEventPreference: React.Dispatch<React.SetStateAction<string[]>>;
  demographic: string[];
  setDemographic: React.Dispatch<React.SetStateAction<string[]>>;
}

const BusinessCustomerContext = createContext<BusinessCustomerContextProps | undefined>(undefined);

export const BusinessCustomerProvider = ({ children }: { children: ReactNode }) => {
  const [idealCustomer, setIdealCustomer] = useState<string>('');
  const [eventPreference, setEventPreference] = useState<string[]>([]);
  const [demographic, setDemographic] = useState<string[]>([]);

  return (
    <BusinessCustomerContext.Provider value={{ idealCustomer, setIdealCustomer, eventPreference, setEventPreference, demographic, setDemographic }}>
      {children}
    </BusinessCustomerContext.Provider>
  );
};

export const useBusinessCustomerContext = () => {
  const context = useContext(BusinessCustomerContext);
  if (!context) {
    throw new Error('useBusinessCustomerContext must be used within a BusinessCustomerProvider');
  }
  return context;
};