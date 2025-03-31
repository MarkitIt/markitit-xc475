export interface Event {
  id: string;
  name: string;
  image: string;
  location: {
    city: string;
    state: string;
  };
  type?: string[];
  vendorFee?: number;
  totalCost?: number;
  attendeeType?: string[];
  headcount?: number;
  demographics?: string[];
  startDate?: { seconds: number; nanoseconds: number };
  endDate?: { seconds: number; nanoseconds: number };
  description?: string;
  categories?: string[];
  score?: number;
  scoreBreakdown?: any;
} 