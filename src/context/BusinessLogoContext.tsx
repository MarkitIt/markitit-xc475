"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface BusinessLogoContextProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const BusinessLogoContext = createContext<BusinessLogoContextProps | undefined>(undefined);

export const BusinessLogoProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<File[]>([]);

  return (
    <BusinessLogoContext.Provider value={{ images, setImages }}>
      {children}
    </BusinessLogoContext.Provider>
  );
};

export const useBusinessLogoContext = () => {
  const context = useContext(BusinessLogoContext);
  if (!context) {
    throw new Error('useBusinessLogoContext must be used within a BusinessLogoProvider');
  }
  return context;
};