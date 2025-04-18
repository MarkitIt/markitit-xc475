export interface Vendor {
    uid?: string;
    businessName?: string;
    contactName?: string;
    email?: string;
    phoneNumber?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    etsy?: string;
    //p2
    type: 'food' | 'market';
    //p3
    categories: string[];
    ethnicFoodCategories?: string[];
    description: string;
    //p4
    priceRange: {
      min: number;
      max: number;
    };
    createOwnProducts: boolean;
    eventPreference: string[];
    cities: string[];
    hasOwnSetup: boolean | 'depends';
    schedule: {
      preferredDays: string[];
    };
    preferredEventSize: string;
    demographic: string[];
    travelRadius?: number;
    coordinates: { lat: number; lng: number };
    //p5
    budget?: {
      maxVendorFee?: number;
      totalCostEstimate?: number;
    };
    idealCustomer?: string;
    selectedPastPopups?: string[];
    //media - can be either File objects during upload or URLs after storage
    logo?: File | string;
    images?: Array<File | string>;
    //optional
    additionalInfo?: string;
    //metadata
    createdAt?: Date;
    updatedAt?: Date;
}