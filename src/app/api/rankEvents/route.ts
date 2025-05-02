import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin"; // Use Admin SDK
import { Vendor } from "@/types/Vendor"; // Adjust path if needed
import { Timestamp } from "firebase-admin/firestore";

// --- Define Max Points Constant Globally --- Accessbile by calculateEventScore and POST
const MAX_POINTS = {
    EVENT_TYPE: 15, // eventTypeScore
    LOCATION: 20,   // locationScore
    BUDGET: 20,     // budgetScore
    DEMOGRAPHICS: 15, // demographicsScore
    EVENT_SIZE: 8, // eventSizeScore (Now primarily num_vendors)
    SCHEDULE: 10,   // scheduleScore
    PRODUCTS: 10, // productsScore (was productsScore)
    CATEGORY: 5, // categoryScore (New/Reinstated)
    HEADCOUNT: 7, // headcountScore (New/Reinstated)
};

// Define the structure for eventsFormatted documents
export interface EventFormatted {
  id: string; // Document ID
  originalEventId: string;
  eventDataId: string | null;
  name: string;
  startDate: Timestamp | Date | null;
  endDate: Timestamp | Date | null;
  location: {
    city: string;
    state: string;
    // Add other potential location details if they exist
    // street?: string;
    // zip?: string;
  } | null; // Location can be null
  image: string | null;
  description: string | null; // Description can be null
  booth_fees: Record<string, number> | string | null; // Updated to allow map, string, or null/undefined
  category_tags: string[] | null; // e.g., ["Art fair", "Outdoor festivals"], can be null
  type: string | null; // e.g., "Market", can be null - Needed for categoryScore?
  demographic_guess: string[] | null; // e.g., ["Families", "Local Regulars"], can be null
  vendor_categories: string[] | null; // e.g., ["Jewelry", "Handmade Goods"], can be null - Used for productsScore
  num_vendors: number | null; // Numeric count - Used for eventSizeScore (now just vendor count)
  estimated_headcount: number | null; // Used for headcountScore
  headcount_min: number | null;
  headcount_max: number | null;
  timestamp?: Timestamp;
  // Remove deprecated fields relevant to scoring from the source interface if they don't exist in data
  // host_reviews_average?: number | null;
  // past_event_performance_score?: number | null;
}

// Interface for vendor rankings cache
interface VendorRankingCache {
  lastRanked: Timestamp;
  rankedEvents: (EventFormatted & { score: number; scoreBreakdown: ScoreBreakdown })[];
}

// Interface for the breakdown of scores using the SPECIFIED NINE FACTORS
export interface ScoreBreakdown {
  // Raw Scores (0 to MAX_POINTS for the factor)
  eventTypeScoreRaw: number;
  locationScoreRaw: number;
  budgetScoreRaw: number;
  demographicsScoreRaw: number;
  eventSizeScoreRaw: number; // Num Vendors
  scheduleScoreRaw: number;
  productsScoreRaw: number; // Vendor Categories
  categoryScoreRaw: number; // Event Category/Type
  headcountScoreRaw: number; // Estimated Headcount

  // Max Points for Raw Scores
  eventTypeScoreMax: number;
  locationScoreMax: number;
  budgetScoreMax: number;
  demographicsScoreMax: number;
  eventSizeScoreMax: number;
  scheduleScoreMax: number;
  productsScoreMax: number;
  categoryScoreMax: number;
  headcountScoreMax: number;

  // Weighted Scores (Raw Score * Rank Multiplier)
  eventTypeScoreWeighted: number;
  locationScoreWeighted: number;
  budgetScoreWeighted: number;
  demographicsScoreWeighted: number;
  eventSizeScoreWeighted: number;
  scheduleScoreWeighted: number;
  productsScoreWeighted: number;
  categoryScoreWeighted: number;
  headcountScoreWeighted: number;

  // Total Scores
  totalWeightedSum: number; // The sum of the weighted scores (sum of all _Weighted fields)
  maxPossibleWeightedSum: number; // The maximum possible sum of weighted scores for this vendor's priorities
  total: number; // The final normalized score (0-100)

  // Deprecated fields initialized to 0 for compatibility with older structures
  vendorCategoryScore: number; // Deprecated - now productsScore
  categoryScore: number; // Deprecated (old key)
  headcountScore: number; // Deprecated (old key)
  vendorsNeededScore: number; // Deprecated
  descriptionScore: number; // Deprecated
  pastEventScore: number; // Deprecated
  hostReviewScore: number; // Deprecated
  pastPerformanceScore: number; // Deprecated
}


// --- Helper function to parse booth fees ---
// Returns {min: number, max: number} or null if unparseable or free
function parseBoothFee(feeData: Record<string, number> | string | null): { min: number; max: number } | null {
  if (feeData === null || feeData === undefined) return null;

  if (typeof feeData === 'object') {
      const prices = Object.values(feeData).filter(v => typeof v === 'number' && v >= 0);
      if (prices.length > 0) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          return { min, max };
      }
      return null; // Object exists but contains no valid numbers
  }

  // Assume it's a string if not an object
  if (typeof feeData !== 'string' || !feeData.trim()) return null; // Handle empty or non-string input

  const lowerCaseFee = feeData.toLowerCase().trim();
  if (lowerCaseFee === 'n/a' || lowerCaseFee === 'free') {
    return { min: 0, max: 0 };
  }

  // Remove $, spaces, and commas for easier parsing
  const cleanedFee = feeData.replace(/\$|\s|,/g, '');

  // Check for a range (e.g., 50-100 or 50.50-100.00)
  const rangeMatch = cleanedFee.match(/^(\d+(\.\d+)?)-(\d+(\.\d+)?)$/); // Allow decimals
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[3]);
    if (!isNaN(min) && !isNaN(max)) {
       return { min: Math.min(min, max), max: Math.max(min, max) }; // Ensure min <= max and are valid numbers
    }
  }

  // Check for a single number (e.g., 100 or 100.50)
  const numberMatch = cleanedFee.match(/^(\d+(\.\d+)?)$/); // Allow decimals
  if (numberMatch) {
    const fee = parseFloat(numberMatch[1]);
     if (!isNaN(fee)) {
       return { min: fee, max: fee };
     }
  }

  // Check for text indicating a range like 'starts at' or 'from'
   const textRangeMatch = lowerCaseFee.match(/^(starts at|from)\s*(\d+(\.\d+)?)/); // Allow decimals
   if (textRangeMatch) {
       const fee = parseFloat(textRangeMatch[2]);
        if (!isNaN(fee)) {
            return { min: fee, max: Infinity }; // Treat as a minimum
        }
   }

  console.warn(`Could not parse booth fee: "${feeData}"`);
  return null; // Indicate unparseable fee
}


// --- Scoring Function ---
const calculateEventScore = (vendor: Vendor, event: EventFormatted): ScoreBreakdown => {
    // Score assigned when data is missing on one side (vendor pref or event data)
    const NEUTRAL_SCORE_PROPORTION = 0.5; // 50% of max points for that factor

    // --- Initialize Score Breakdown WITH Max Points --- 
    const breakdown: ScoreBreakdown = {
        // Raw Scores
        eventTypeScoreRaw: 0,
        locationScoreRaw: 0,
        budgetScoreRaw: 0,
        demographicsScoreRaw: 0,
        eventSizeScoreRaw: 0,
        scheduleScoreRaw: 0,
        productsScoreRaw: 0,
        categoryScoreRaw: 0,
        headcountScoreRaw: 0,

        // Max Points - Initialize using the global constant
        eventTypeScoreMax: MAX_POINTS.EVENT_TYPE,
        locationScoreMax: MAX_POINTS.LOCATION,
        budgetScoreMax: MAX_POINTS.BUDGET,
        demographicsScoreMax: MAX_POINTS.DEMOGRAPHICS,
        eventSizeScoreMax: MAX_POINTS.EVENT_SIZE,
        scheduleScoreMax: MAX_POINTS.SCHEDULE,
        productsScoreMax: MAX_POINTS.PRODUCTS,
        categoryScoreMax: MAX_POINTS.CATEGORY,
        headcountScoreMax: MAX_POINTS.HEADCOUNT,

        // Weighted Scores
        eventTypeScoreWeighted: 0,
        locationScoreWeighted: 0,
        budgetScoreWeighted: 0,
        demographicsScoreWeighted: 0,
        eventSizeScoreWeighted: 0,
        scheduleScoreWeighted: 0,
        productsScoreWeighted: 0,
        categoryScoreWeighted: 0,
        headcountScoreWeighted: 0,

        // Total Scores
        totalWeightedSum: 0,
        maxPossibleWeightedSum: 0,
        total: 0,

        // Deprecated fields
        vendorCategoryScore: 0,
        categoryScore: 0,
        headcountScore: 0,
        vendorsNeededScore: 0,
        descriptionScore: 0,
        pastEventScore: 0,
        hostReviewScore: 0,
        pastPerformanceScore: 0
    };

    // Convert vendor arrays to lowercase sets for efficient lookup and filter empty strings
    const vendorPrefsLower = Array.isArray(vendor.eventPreference) ? new Set(vendor.eventPreference.map(p => typeof p === 'string' ? p.toLowerCase().trim() : '').filter(Boolean)) : new Set<string>();
    const vendorCitiesLower = Array.isArray(vendor.cities) ? new Set(vendor.cities.map(c => typeof c === 'string' ? c.toLowerCase().trim() : '').filter(Boolean)) : new Set<string>();
    const vendorDemosLower = Array.isArray(vendor.demographic) ? new Set(vendor.demographic.map(d => typeof d === 'string' ? d.toLowerCase().trim() : '').filter(Boolean)) : new Set<string>();
    const vendorCatsLower = Array.isArray(vendor.categories) ? new Set(vendor.categories.map(c => typeof c === 'string' ? c.toLowerCase().trim() : '').filter(Boolean)) : new Set<string>();
    const vendorPreferredDaysLower = Array.isArray(vendor.schedule?.preferredDays) ? new Set(vendor.schedule.preferredDays.map((d: string) => typeof d === 'string' ? d.toLowerCase().trim() : '').filter(Boolean)) : new Set<string>();
     const vendorPreferredSizeMin = typeof vendor.preferredEventSize?.min === 'number' ? vendor.preferredEventSize.min : null;
     const vendorPreferredSizeMax = typeof vendor.preferredEventSize?.max === 'number' ? vendor.preferredEventSize.max : null;


    // --- Raw Scoring Logic (Calculate 0 to MAX_POINTS for each) ---

    // 1. eventTypeScore (vendor.eventPreference vs event.category_tags - high level theme)
    // Assuming event.category_tags represents higher-level event types/themes
    const eventTagsLower = Array.isArray(event.category_tags) ? event.category_tags.map(t => typeof t === 'string' ? t.toLowerCase().trim() : '').filter(Boolean) : [];
    if (vendorPrefsLower.size > 0 && eventTagsLower.length > 0) {
        const matches = eventTagsLower.filter(tag => vendorPrefsLower.has(tag));
        breakdown.eventTypeScoreRaw = (matches.length / Math.max(vendorPrefsLower.size, eventTagsLower.length)) * MAX_POINTS.EVENT_TYPE; // Score based on mutual match proportion
    } else if (vendorPrefsLower.size > 0 || eventTagsLower.length > 0) {
        breakdown.eventTypeScoreRaw = MAX_POINTS.EVENT_TYPE * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.eventTypeScoreRaw = 0;


    // 2. locationScore (vendor.cities vs event.location.city)
    const eventCityLower = typeof event.location?.city === 'string' ? event.location.city.toLowerCase().trim() : null;
    if (vendorCitiesLower.size > 0 && eventCityLower) {
        if (vendorCitiesLower.has(eventCityLower)) {
            breakdown.locationScoreRaw = MAX_POINTS.LOCATION;
        } else breakdown.locationScoreRaw = 0;
    } else if (vendorCitiesLower.size > 0 || eventCityLower) {
        breakdown.locationScoreRaw = MAX_POINTS.LOCATION * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.locationScoreRaw = 0;


    // 3. budgetScore (vendor.budget.maxVendorFee vs event.booth_fees)
    const vendorMaxFee = typeof vendor.budget?.maxVendorFee === 'number' && vendor.budget.maxVendorFee >= 0 ? vendor.budget.maxVendorFee : null;
    const parsedBoothFee = parseBoothFee(event.booth_fees);
    if (vendorMaxFee !== null && parsedBoothFee !== null) {
       if (parsedBoothFee.max === 0) { // Free events
         breakdown.budgetScoreRaw = MAX_POINTS.BUDGET;
       } else if (vendorMaxFee >= parsedBoothFee.min) {
           if (parsedBoothFee.max !== Infinity && vendorMaxFee >= parsedBoothFee.max) {
               breakdown.budgetScoreRaw = MAX_POINTS.BUDGET;
           } else {
               const range = parsedBoothFee.max === Infinity ? parsedBoothFee.min || 1 : parsedBoothFee.max - parsedBoothFee.min; // Prevent division by zero
                  const proportion = Math.min(1, (vendorMaxFee - parsedBoothFee.min) / range);
               breakdown.budgetScoreRaw = MAX_POINTS.BUDGET * (0.7 + 0.3 * proportion);
           }
       } else { // Vendor budget below min fee
           const diff = parsedBoothFee.min - vendorMaxFee;
           const normalizationBase = vendorMaxFee > 0 ? vendorMaxFee : MAX_POINTS.BUDGET; // Use MAX_POINTS as base if vendor budget is 0
           const overBudgetFactor = Math.min(1, diff / normalizationBase);
           breakdown.budgetScoreRaw = Math.max(0, MAX_POINTS.BUDGET * (1 - overBudgetFactor));
       }
    } else if (vendorMaxFee !== null || parsedBoothFee !== null) {
         breakdown.budgetScoreRaw = MAX_POINTS.BUDGET * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.budgetScoreRaw = 0;


    // 4. demographicsScore (vendor.demographic vs event.demographic_guess)
    const eventGuessLower = Array.isArray(event.demographic_guess) ? event.demographic_guess.map(g => typeof g === 'string' ? g.toLowerCase().trim() : '').filter(Boolean) : [];
    if (vendorDemosLower.size > 0 && eventGuessLower.length > 0) {
        const overlap = eventGuessLower.filter(guess => vendorDemosLower.has(guess));
        breakdown.demographicsScoreRaw = (overlap.length / Math.max(vendorDemosLower.size, eventGuessLower.length)) * MAX_POINTS.DEMOGRAPHICS; // Score based on mutual match proportion
    } else if (vendorDemosLower.size > 0 || eventGuessLower.length > 0) {
        breakdown.demographicsScoreRaw = MAX_POINTS.DEMOGRAPHICS * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.demographicsScoreRaw = 0;


    // 5. eventSizeScore (Now based ONLY on num_vendors vs vendor.preferredEventSize)
    const eventNumVendors = event.num_vendors;
    if (vendorPreferredSizeMin !== null && vendorPreferredSizeMax !== null && typeof eventNumVendors === 'number' && eventNumVendors >= 0) {
        if (eventNumVendors >= vendorPreferredSizeMin && eventNumVendors <= vendorPreferredSizeMax) {
            breakdown.eventSizeScoreRaw = MAX_POINTS.EVENT_SIZE; // Perfect match within preferred vendor count range
        } else {
             // Penalize based on how far outside the preferred range the vendor count is
             let diff = 0;
             if (eventNumVendors < vendorPreferredSizeMin) diff = vendorPreferredSizeMin - eventNumVendors;
             else if (vendorPreferredSizeMax !== Infinity) diff = eventNumVendors - vendorPreferredSizeMax;

             if (diff > 0) {
                 const rangeSize = vendorPreferredSizeMax === Infinity ? vendorPreferredSizeMin || 10 : vendorPreferredSizeMax - vendorPreferredSizeMin;
                 const normalizationBase = rangeSize > 0 ? rangeSize : 10; // Use a base if range is zero/small
                 const deviationFactor = Math.min(1, diff / normalizationBase);
                 breakdown.eventSizeScoreRaw = Math.max(0, MAX_POINTS.EVENT_SIZE * (1 - deviationFactor)); // Linear penalty
             } else breakdown.eventSizeScoreRaw = MAX_POINTS.EVENT_SIZE; // Should be covered by perfect match, fallback
        }
    } else if ((vendorPreferredSizeMin !== null && vendorPreferredSizeMax !== null) || (typeof eventNumVendors === 'number' && eventNumVendors >= 0)) {
        breakdown.eventSizeScoreRaw = MAX_POINTS.EVENT_SIZE * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.eventSizeScoreRaw = 0;


    // 6. scheduleScore (vendor.schedule.preferredDays vs event dates)
    const eventDays = new Set<string>();
    const start = event.startDate ? ((event.startDate as any) instanceof Timestamp ? (event.startDate as Timestamp).toDate() : event.startDate as Date) : null;
    const end = event.endDate ? ((event.endDate as any) instanceof Timestamp ? (event.endDate as Timestamp).toDate() : event.endDate as Date) : null;
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    if (start && end && end >= start && vendorPreferredDaysLower.size > 0) {
        let currentDay = new Date(start);
        let daysOfEvent = new Set<string>();
        let dayCount = 0;
        const MAX_DAYS_TO_CHECK = 365;

        while (currentDay <= end && dayCount < MAX_DAYS_TO_CHECK) {
            daysOfEvent.add(dayNames[currentDay.getDay()]);
            currentDay.setDate(currentDay.getDate() + 1);
            dayCount++;
        }

        if (daysOfEvent.size > 0) {
            const matches = Array.from(daysOfEvent).filter(day => vendorPreferredDaysLower.has(day));
            breakdown.scheduleScoreRaw = (matches.length / daysOfEvent.size) * MAX_POINTS.SCHEDULE;
        } else breakdown.scheduleScoreRaw = 0; // Event has dates but couldn't determine days
    } else if ((start && end && end >= start) || vendorPreferredDaysLower.size > 0) {
        breakdown.scheduleScoreRaw = MAX_POINTS.SCHEDULE * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.scheduleScoreRaw = 0;


    // 7. productsScore (Renamed from productsScore - vendor.categories vs event.vendor_categories)
    const eventVendorCatsLower = Array.isArray(event.vendor_categories) ? event.vendor_categories.map(ec => typeof ec === 'string' ? ec.toLowerCase().trim() : '').filter(Boolean) : [];
    if (vendorCatsLower.size > 0 && eventVendorCatsLower.length > 0) {
         const matches = eventVendorCatsLower.filter(eventCat => vendorCatsLower.has(eventCat));
         breakdown.productsScoreRaw = (matches.length / Math.max(vendorCatsLower.size, eventVendorCatsLower.length)) * MAX_POINTS.PRODUCTS; // Score based on mutual match proportion
     } else if (vendorCatsLower.size > 0 || eventVendorCatsLower.length > 0) {
         breakdown.productsScoreRaw = MAX_POINTS.PRODUCTS * NEUTRAL_SCORE_PROPORTION;
     } else breakdown.productsScoreRaw = 0;


// 8. categoryScore (Full score if ANY match between vendor.eventPreference and event.category_tags)
const vendorPrefsLowerCategory = Array.isArray(vendor.eventPreference) ? new Set(vendor.eventPreference.map(p => typeof p === 'string' ? p.toLowerCase().trim() : '').filter(Boolean)) : new Set<string>();
const eventTagsLowerCategory = Array.isArray(event.category_tags) ? event.category_tags.map(t => typeof t === 'string' ? t.toLowerCase().trim() : '').filter(Boolean) : [];

if (vendorPrefsLowerCategory.size > 0 && eventTagsLowerCategory.length > 0) {
    // Check for *any* overlap
    let hasMatch = false;
    for (const tag of eventTagsLowerCategory) {
        if (vendorPrefsLowerCategory.has(tag)) {
            hasMatch = true;
            break; // Found a match, no need to check further
        }
    }

    if (hasMatch) {
        breakdown.categoryScoreRaw = MAX_POINTS.CATEGORY; // Full score if at least one match
    } else {
        breakdown.categoryScoreRaw = 0; // 0 score if no matches found but both lists had data
    }

} else if (vendorPrefsLowerCategory.size > 0 || eventTagsLowerCategory.length > 0) {
    // If only one side has data, we can't confirm a match or mismatch.
    // Assign a neutral score as there's potential but no data on the other side to confirm.
    breakdown.categoryScoreRaw = MAX_POINTS.CATEGORY * NEUTRAL_SCORE_PROPORTION;
} else {
     // If both are empty, no basis for matching
     breakdown.categoryScoreRaw = 0;
}


    // 9. headcountScore (Reinstated - based on estimated_headcount vs vendor.preferredEventSize)
    const eventHeadcountValue = event.estimated_headcount !== null && event.estimated_headcount >= 0 ? event.estimated_headcount : null;
     if (vendorPreferredSizeMin !== null && vendorPreferredSizeMax !== null && eventHeadcountValue !== null) {
        if (eventHeadcountValue >= vendorPreferredSizeMin && eventHeadcountValue <= vendorPreferredSizeMax) {
            breakdown.headcountScoreRaw = MAX_POINTS.HEADCOUNT; // Perfect match within preferred headcount range
        } else {
             // Penalize based on how far outside the preferred range the headcount is
             let diff = 0;
             if (eventHeadcountValue < vendorPreferredSizeMin) diff = vendorPreferredSizeMin - eventHeadcountValue;
             else if (vendorPreferredSizeMax !== Infinity) diff = eventHeadcountValue - vendorPreferredSizeMax;

             if (diff > 0) {
                 const rangeSize = vendorPreferredSizeMax === Infinity ? vendorPreferredSizeMin || 1000 : vendorPreferredSizeMax - vendorPreferredSizeMin; // Use a base if range is zero/small
                 const normalizationBase = rangeSize > 0 ? rangeSize : 1000;
                 const deviationFactor = Math.min(1, diff / normalizationBase);
                 breakdown.headcountScoreRaw = Math.max(0, MAX_POINTS.HEADCOUNT * (1 - deviationFactor)); // Linear penalty
             } else breakdown.headcountScoreRaw = MAX_POINTS.HEADCOUNT; // Should be covered by perfect match, fallback
        }
    } else if ((vendorPreferredSizeMin !== null && vendorPreferredSizeMax !== null) || eventHeadcountValue !== null) {
        breakdown.headcountScoreRaw = MAX_POINTS.HEADCOUNT * NEUTRAL_SCORE_PROPORTION;
    } else breakdown.headcountScoreRaw = 0;


    // --- Define the 9 Factors and Their Mapping ---
    // This array links the vendor priority string to the raw score key and max points
    const factorMeta = [
        { name: "Event Type/Theme", key: "eventTypeScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.EVENT_TYPE },
        { name: "Location", key: "locationScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.LOCATION },
        { name: "Costs", key: "budgetScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.BUDGET },
        { name: "Target Audience", key: "demographicsScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.DEMOGRAPHICS },
        { name: "Number of Vendors", key: "eventSizeScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.EVENT_SIZE }, // Using this name for the vendor count factor
        { name: "Schedule", key: "scheduleScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.SCHEDULE },
        { name: "Product Category Relevance", key: "productsScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.PRODUCTS }, // Using this name for product category factor
        { name: "Event Category", key: "categoryScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.CATEGORY }, // Using this name for event category factor
        { name: "Estimated Headcount", key: "headcountScoreRaw" as keyof ScoreBreakdown, maxPoints: MAX_POINTS.HEADCOUNT }, // Using this name for headcount factor
    ];

    // --- Define Rank Multipliers (Using Linear as Default) ---
    // Multipliers for ranks 1 through 9 (adjust these values as needed)
    const rankMultipliers: { [rank: number]: number } = {
        1: 1.5, 2: 1.4, 3: 1.3, 4: 1.2, 5: 1.1,
        6: 1.0, 7: 0.9, 8: 0.8, 9: 0.7,
    };
    // You could swap this for quadratic or other sets if preferred

    // --- Calculate Total Weighted Score and Max Possible Total Weighted Score ---
    let totalWeightedScore = 0;
    let maxPossibleTotalWeightedScore = 0;

    // Use a map for quicker lookup of factor metadata by name
    const factorMetaMap = new Map(factorMeta.map(item => [item.name, item]));

    // Ensure vendor.eventPriorityFactors is a valid array of 9 strings matching factorMeta names
    const vendorPriorities = Array.isArray(vendor.eventPriorityFactors) && vendor.eventPriorityFactors.length === 9
        ? vendor.eventPriorityFactors
        : factorMeta.map(m => m.name); // Default to alphabetical names if vendor data is bad

    vendorPriorities.forEach((factorName, index) => {
        const rank = index + 1; // Rank is index + 1 (0-indexed array)
        const multiplier = rankMultipliers[rank] || 1.0; // Default to 1.0 if rank unexpected

        const meta = factorMetaMap.get(factorName);

        if (meta && breakdown.hasOwnProperty(meta.key)) {
             const rawScore = breakdown[meta.key];
             const maxPoints = meta.maxPoints;

             // Add to totals
             totalWeightedScore += (rawScore || 0) * multiplier;
             maxPossibleTotalWeightedScore += (maxPoints || 0) * multiplier;
        } else {
             console.warn(`Unknown or mismatched factor name "${factorName}" at rank ${rank}. Skipping or using default.`);
             // If a factor name is unknown, it contributes 0 to the score.
             // maxPossibleTotalWeightedScore should still account for the theoretical max
             // for *some* factor at this rank, but mapping failure makes this hard.
             // The fallback above helps ensure maxPossibleTotalWeightedScore isn't zero unexpectedly.
        }
    });

     // Fallback check for maxPossibleTotalWeightedScore in case it's still zero due to meta issues
     if (maxPossibleTotalWeightedScore <= 0) {
          // As a last resort, sum the default MAX_POINTS if priority-based max couldn't be computed
          maxPossibleTotalWeightedScore = Object.values(MAX_POINTS).reduce((sum, p) => sum + p, 0);
          console.warn(`maxPossibleTotalWeightedScore was zero or less. Falling back to sum of base MAX_POINTS: ${maxPossibleTotalWeightedScore}`);
          // If still zero, set to 1 to avoid division error, though score will be 0
          if (maxPossibleTotalWeightedScore <= 0) maxPossibleTotalWeightedScore = 1;
     }


    // --- Normalize to Get Final Score (0-100) ---
    let finalScore = (totalWeightedScore / maxPossibleTotalWeightedScore) * 100;


    // --- Clamp the Score to Guarantee 0-100 Range ---
    breakdown.total = Math.round(Math.max(0, Math.min(100, finalScore)));

    return breakdown; // Return the detailed breakdown including the final total score
};


// --- API Route Handler (POST) ---
// --- API Route Handler (POST) ---
export async function POST(request: Request) {
  try {
    const { vendorId } = await request.json();

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      );
    }

    // Get vendor document
    const vendorDoc = await adminDb.collection("vendorProfile").doc(vendorId).get();
    if (!vendorDoc.exists) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    const vendor = vendorDoc.data() as Vendor;
     if (!vendor) { // Double check data exists
         return NextResponse.json(
             { error: "Vendor data is empty" },
             { status: 404 }
         );
     }


    // Get all events
    // Consider adding filtering here (e.g., future events, location proximity) for efficiency
    const eventsSnapshot = await adminDb.collection("eventsFormatted").get();
    const events = eventsSnapshot.docs.map(doc => {
      const { id: _, ...data } = doc.data() as EventFormatted;
      return {
        ...data,
        id: doc.id
      };
    }) as EventFormatted[];

     if (events.length === 0) {
         return NextResponse.json({ rankedEvents: [] }); // Return empty array if no events
     }


    // Calculate scores for each event
    const rankedEvents = events.map(event => {
      const scoreBreakdown = calculateEventScore(vendor, event);
      return {
        ...event,
        score: scoreBreakdown.total, // Use the normalized total score
        startDate: event.startDate && (event.startDate as any) instanceof Timestamp ? {
          seconds: (event.startDate as Timestamp).seconds,
          nanoseconds: (event.startDate as Timestamp).nanoseconds
        } : null,
        endDate: event.endDate && (event.endDate as any) instanceof Timestamp ? {
          seconds: (event.endDate as Timestamp).seconds,
          nanoseconds: (event.endDate as Timestamp).nanoseconds
        } : null,
        timestamp: event.timestamp && (event.timestamp as any) instanceof Timestamp ? {
          seconds: (event.timestamp as Timestamp).seconds,
          nanoseconds: (event.timestamp as Timestamp).nanoseconds
         } : null,
        location: event.location || null,
         category_tags: event.category_tags || null,
         demographic_guess: event.demographic_guess || null,
         vendor_categories: event.vendor_categories || null,
        name: event.name || 'Unnamed Event',
         description: event.description || null,
         type: event.type || null,
         num_vendors: event.num_vendors !== undefined ? event.num_vendors : null,
         estimated_headcount: event.estimated_headcount !== undefined ? event.estimated_headcount : null,
         headcount_min: event.headcount_min !== undefined ? event.headcount_min : null,
         headcount_max: event.headcount_max !== undefined ? event.headcount_max : null,
         booth_fees: event.booth_fees !== undefined ? event.booth_fees : null,

        // --- CORRECTED scoreBreakdown mapping ---
        scoreBreakdown: scoreBreakdown // Return the fully populated breakdown object
      };
    });

    // Sort by score (highest first)
    rankedEvents.sort((a, b) => b.score - a.score);

    // --- MODIFIED Caching Logic ---
    // Cache only essential ranking data (ID and score) to avoid exceeding document size limit
    const essentialRankedEventData = rankedEvents.map(event => ({
        id: event.id,
        score: event.score
        // Optionally include scoreBreakdown.total if it's different and needed
        // totalBreakdownScore: event.scoreBreakdown.total 
    }));

    const cacheDocRef = adminDb.collection("vendorRankings").doc(vendorId);
    await cacheDocRef.set({
      lastRanked: Timestamp.now(),
      // Store only the essential data
      rankedEvents: essentialRankedEventData 
    });

    // Return the full ranked events data (including details) in the API response
    return NextResponse.json({
      rankedEvents // Still return the full data in the response, just not in the cache doc
    });

  } catch (error) {
    // Restore robust error logging and response
    console.error("Error ranking events:", error);
    const detailsMessage = error instanceof Error ? error.message : "An unknown error occurred during ranking.";
    return NextResponse.json(
      { error: "Failed to rank events", details: detailsMessage },
      { status: 500 }
    );
  }
}


// --- API Route Handler (GET) ---
export async function GET() {
  // Indicate that POST is the required method
  return NextResponse.json({ message: "Method Not Allowed. Use POST with vendorId in body to rank events." }, { status: 405 });
}
