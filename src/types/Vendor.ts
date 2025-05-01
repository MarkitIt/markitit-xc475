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
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  //p2
  type: "food" | "market";
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
  hasOwnSetup: boolean | "depends";
  schedule: {
    preferredDays: string[];
  };
  preferredEventSize: {
    min: number;
    max: number;
  };
  demographic: string[];
  travelRadius?: number;
  //p5
  budget?: {
    maxVendorFee?: number;
    totalCostEstimate?: number;
  };
  //media - can be either File objects during upload or URLs after storage
  logo?: File | string;
  images?: Array<File | string>;
  //optional
  additionalInfo?: string;
  eventPriorityFactors?: string[];
  //metadata
  createdAt?: Date;
  updatedAt?: Date;
}
