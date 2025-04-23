import { createContext, useContext, useState, ReactNode } from "react";
import { Vendor } from "../types/Vendor";

interface VendorContextType {
  vendor: Vendor | null;
  setVendor: (vendor: Vendor | null) => void;
  updateVendor: (updates: Partial<Vendor>) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Vendor | null>(null);

  const updateVendor = (updates: Partial<Vendor>) => {
    setVendor((prev) => (prev ? { ...prev, ...updates } : (updates as Vendor)));
  };

  return (
    <VendorContext.Provider value={{ vendor, setVendor, updateVendor }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
}
