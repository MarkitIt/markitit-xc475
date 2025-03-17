"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessBudgetContextProps {
  maxApplicationFee: number;
  setMaxApplicationFee: React.Dispatch<React.SetStateAction<number>>;
  maxVendorFee: number;
  setVendorFee: React.Dispatch<React.SetStateAction<number>>;
  totalCostEstimate: number;
  setTotalCostEstimate: React.Dispatch<React.SetStateAction<number>>;
}

const BusinessBudgetContext = createContext<BusinessBudgetContextProps | undefined>(undefined);

export const BusinessBudgetProvider = ({ children }: { children: ReactNode }) => {
  const [maxApplicationFee, setMaxApplicationFee] = useState<number>(0);
  const [maxVendorFee, setVendorFee] = useState<number>(0);
  const [totalCostEstimate, setTotalCostEstimate] = useState<number>(0);

  return (
    <BusinessBudgetContext.Provider value={{ maxApplicationFee, setMaxApplicationFee, maxVendorFee, setVendorFee, totalCostEstimate, setTotalCostEstimate }}>
      {children}
    </BusinessBudgetContext.Provider>
  );
};

export const useBusinessBudgetContext = () => {
  const context = useContext(BusinessBudgetContext);
  if (!context) {
    throw new Error('useBusinessBudgetContext must be used within a BusinessBudgetProvider');
  }
  return context;
};