'use client';

import React, { createContext, useContext, useState } from 'react';

interface HostContextType {
  hostProfile: boolean;
  setHostProfile: (value: boolean) => void;
}

const HostContext = createContext<HostContextType | undefined>(undefined);

export const HostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hostProfile, setHostProfile] = useState<boolean>(false); // Default to false

  return (
    <HostContext.Provider value={{ hostProfile, setHostProfile }}>
      {children}
    </HostContext.Provider>
  );
};

export const useHostContext = () => {
  const context = useContext(HostContext);
  if (!context) {
    throw new Error('useHostContext must be used within a HostProvider');
  }
  return context;
};