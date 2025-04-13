export interface Vendor {
    uid?: string;
    //p1

    businessName?: string;
    contactName?: string;
    email?: string;
    phoneNumber?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    etsy?: string;
    //p2
    vendorType?: string;
    eventPreference?: string[];
    travelRadius?: number;
    coordinates: { lat: number; lng: number };
    categories: string[];
    budget?: {
      maxVendorFee?: number;
      totalCostEstimate?: number;
    };
    idealCustomer?: string;
    demographic?: string[];
    selectedPastPopups?: string[];
    preferredEventSize?: {
      min?: number;
      max?: number;
    };
    schedule?: {
      preferredDays?: string[];
    };
}