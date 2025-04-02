interface Vendor {
    uid?: string;
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
    description?: string;
  }