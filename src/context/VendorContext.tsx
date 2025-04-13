import { createContext, useContext, useState, ReactNode } from 'react';
import { Vendor } from '../types/Vendor';

interface VendorContextType {
  vendor: Vendor;
  setVendor: (vendor: Vendor) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendor] = useState<Vendor>({
    businessName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    website: '',
    instagram: '',
    facebook: '',
    etsy: '',
    coordinates: { lat: 0, lng: 0 },
    categories: []
  });

  return (
    <VendorContext.Provider value={{ vendor, setVendor }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}
