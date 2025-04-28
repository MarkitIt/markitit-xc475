import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin"; // Use Admin SDK
import { Vendor } from "@/types/Vendor"; // Adjust path if needed
import { Timestamp } from "firebase-admin/firestore";

// Define the structure for eventsFormatted documents
interface EventFormatted {
  id: string; // Document ID
  originalEventId: string;
  eventDataId: string | null;
  name: string;
  startDate: Timestamp | null; // Use Firestore Timestamp
  endDate: Timestamp | null; // Use Firestore Timestamp
  location: {
    city: string;
    state: string;
  };
  image: string | null;
  description: string;
  booth_fees: string; // e.g., "N/A", "$100", "$50 - $100"
  category_tags: string[]; // e.g., ["Art fair", "Outdoor festivals"]
  type: string; // e.g., "Market"
  demographic_guess: string[]; // e.g., ["Families", "Local Regulars"]
  vendor_categories: string[]; // e.g., ["Jewelry", "Handmade Goods"]
  num_vendors: number | null; // Numeric count
  estimated_headcount: number | null; // Assuming this exists, though not explicitly used
  headcount_min: number | null; // Assuming this exists, though not explicitly used
  headcount_max: number | null; // Assuming this exists, though not explicitly used
  timestamp: Timestamp; // Use Firestore Timestamp
}


// Interface for the breakdown of scores
interface ScoreBreakdown {
  eventTypeScore: number; // Compares vendor.eventPreference and event.category_tags
  locationScore: number; // Compares vendor.cities and event.location.city
  budgetScore: number; // Compares vendor.budget.maxVendorFee and event.booth_fees
  demographicsScore: number; // Compares vendor.demographic and event.demographic_guess
  eventSizeScore: number; // Compares vendor.preferredEventSize and event.num_vendors
  scheduleScore: number; // Compares vendor.schedule.preferredDays and event dates
  vendorCategoryScore: number; // Compares vendor.categories and event.vendor_categories
  total: number;
  // Keep removed fields as 0 for structure compatibility if needed elsewhere
  pastEventScore: number;
  headcountScore: number;
  categoryScore: number;
  vendorsNeededScore: number;
  descriptionScore: number;
}

// --- Helper function to parse booth fees ---
// Returns {min: number, max: number} or null if unparseable
function parseBoothFee(feeString: string): { min: number; max: number } | null {
  if (!feeString || typeof feeString !== 'string') return null; // Handle undefined/null/non-string input

  const lowerCaseFee = feeString.toLowerCase();
  if (lowerCaseFee === 'n/a' || lowerCaseFee === 'free') {
    return { min: 0, max: 0 };
  }

  // Remove $, spaces, and commas for easier parsing
  const cleanedFee = feeString.replace(/\$|\s|,/g, '');

  // Check for a range (e.g., 50-100)
  const rangeMatch = cleanedFee.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    return { min: Math.min(min, max), max: Math.max(min, max) }; // Ensure min <= max
  }

  // Check for a single number (e.g., 100)
  const numberMatch = cleanedFee.match(/^(\d+)$/);
  if (numberMatch) {
    const fee = parseInt(numberMatch[1], 10);
    return { min: fee, max: fee };
  }

  console.warn(`Could not parse booth fee: "${feeString}"`);
  return null; // Indicate unparseable fee
}



// --- Updated Scoring Function ---
// Takes Vendor type (ensure it's defined correctly) and EventFormatted type
const calculateEventScore = (vendor: Vendor, event: EventFormatted): ScoreBreakdown => {
    // --- Define Max Points per Category ---
    const MAX_POINTS = {
        EVENT_TYPE: 15,
        LOCATION: 20,
        BUDGET: 20,
        DEMOGRAPHICS: 15,
        EVENT_SIZE: 10, // Covers both attendance/size and vendor count/competition
        SCHEDULE: 10,
        VENDOR_CATEGORY: 10,
        // Add HOST_REVIEW later when data is available
        // HOST_REVIEW: 5,
    };
    const TOTAL_POSSIBLE_BASE = Object.values(MAX_POINTS).reduce((sum, p) => sum + p, 0);

    // --- Initialize Raw Scores ---
    const rawBreakdown = {
        eventTypeScore: 0,
        locationScore: 0,
        budgetScore: 0,
        demographicsScore: 0,
        eventSizeScore: 0,
        scheduleScore: 0,
        vendorCategoryScore: 0,
        // hostReviewScore: 0, // Add later
    };

    // --- Scoring Logic (Same as before) ---

    // 1. Event Type Score (vendor.eventPreference vs event.category_tags)
    if (Array.isArray(vendor.eventPreference) && vendor.eventPreference.length > 0 && Array.isArray(event.category_tags) && event.category_tags.length > 0) {
        const vendorPrefsLower = vendor.eventPreference.map(p => typeof p === 'string' ? p.toLowerCase() : '');
        const eventTagsLower = event.category_tags.map(t => typeof t === 'string' ? t.toLowerCase() : '');
        const matches = vendorPrefsLower.filter(pref => pref && eventTagsLower.includes(pref));
        rawBreakdown.eventTypeScore = (matches.length / vendorPrefsLower.length) * MAX_POINTS.EVENT_TYPE;
    }

    // 2. Location Score (vendor.cities vs event.location.city)
    if (Array.isArray(vendor.cities) && vendor.cities.length > 0 && event.location?.city) {
        const cityMatch = vendor.cities.some(city => typeof city === 'string' && city.toLowerCase() === event.location.city.toLowerCase());
        if (cityMatch) {
            rawBreakdown.locationScore = MAX_POINTS.LOCATION;
        }
    }

    // 3. Budget Score (vendor.budget.maxVendorFee vs event.booth_fees)
    const vendorMaxFee = vendor.budget?.maxVendorFee;
    let minBoothFee: number | null = null;
    if (event.booth_fees && typeof event.booth_fees === 'object' && !Array.isArray(event.booth_fees)) {
      const prices = Object.values(event.booth_fees).filter(v => typeof v === 'number');
      if (prices.length > 0) {
        minBoothFee = Math.min(...prices);
      }
    }
    if (typeof vendorMaxFee === 'number' && minBoothFee !== null) {
      if (minBoothFee === 0) rawBreakdown.budgetScore = MAX_POINTS.BUDGET;
      else if (vendorMaxFee >= minBoothFee) rawBreakdown.budgetScore = MAX_POINTS.BUDGET;
      else {
        const diff = minBoothFee - vendorMaxFee;
        if (vendorMaxFee > 0) {
          const overBudgetFactor = Math.min(1, diff / vendorMaxFee);
          rawBreakdown.budgetScore = Math.max(0, MAX_POINTS.BUDGET * (1 - overBudgetFactor * 1.5));
        } else rawBreakdown.budgetScore = MAX_POINTS.BUDGET * 0.5;
      }
    } else {
      // If booth_fees is missing or empty, assign a neutral score
      rawBreakdown.budgetScore = MAX_POINTS.BUDGET * 0.5;
    }

    // 4. Demographics Score (vendor.demographic vs event.demographic_guess)
     // Ensure vendor.demographic exists and is an array
    if (Array.isArray(vendor.demographic) && vendor.demographic.length > 0 && Array.isArray(event.demographic_guess) && event.demographic_guess.length > 0) {
        const vendorDemosLower = vendor.demographic.map(d => typeof d === 'string' ? d.toLowerCase() : '');
        const eventGuessLower = event.demographic_guess.map(g => typeof g === 'string' ? g.toLowerCase() : '');
        const overlap = vendorDemosLower.filter(demo => demo && eventGuessLower.includes(demo));
        rawBreakdown.demographicsScore = (overlap.length / vendorDemosLower.length) * MAX_POINTS.DEMOGRAPHICS;
    }


    // 5. Event Size Score (vendor.preferredEventSize vs event.num_vendors)
     // Ensure preferredEventSize exists and has min/max properties
    const vendorSizeRange = vendor.preferredEventSize;
    const eventNumVendors = event.num_vendors;
    if (vendorSizeRange && typeof vendorSizeRange.min === 'number' && typeof vendorSizeRange.max === 'number' && typeof eventNumVendors === 'number' && eventNumVendors >= 0) {
        if (eventNumVendors >= vendorSizeRange.min && eventNumVendors <= vendorSizeRange.max) {
            rawBreakdown.eventSizeScore = MAX_POINTS.EVENT_SIZE; // Perfect match
        } else {
             // (Same detailed event size deviation logic as before)
             let diff = 0;
             if (eventNumVendors < vendorSizeRange.min) diff = vendorSizeRange.min - eventNumVendors;
             else diff = vendorSizeRange.max === Infinity ? 0 : eventNumVendors - vendorSizeRange.max;

             if (diff > 0) {
                 let normalizationBase = 50;
                 if (vendorSizeRange.max !== Infinity && vendorSizeRange.max > vendorSizeRange.min) normalizationBase = (vendorSizeRange.min + vendorSizeRange.max) / 2;
                 else if (vendorSizeRange.min === 0) normalizationBase = 25;
                 else if (vendorSizeRange.min > 150) normalizationBase = 200;
                 const deviationFactor = Math.min(1, diff / Math.max(1, normalizationBase));
                 rawBreakdown.eventSizeScore = Math.max(0, MAX_POINTS.EVENT_SIZE * (1 - deviationFactor));
             } else rawBreakdown.eventSizeScore = MAX_POINTS.EVENT_SIZE;
        }
    } else rawBreakdown.eventSizeScore = MAX_POINTS.EVENT_SIZE * 0.5; // Neutral score

    // 6. Schedule Score (vendor.schedule.preferredDays vs event dates)
    if (event.startDate && event.endDate && Array.isArray(vendor.schedule?.preferredDays) && vendor.schedule.preferredDays.length > 0) {
        // (Same schedule logic as before)
        const eventDays = new Set<string>();
        const start =
          event.startDate instanceof Timestamp
            ? event.startDate.toDate()
            : event.startDate
              ? new Date(event.startDate)
              : null;
        const end =
          event.endDate instanceof Timestamp
            ? event.endDate.toDate()
            : event.endDate
              ? new Date(event.endDate)
              : null;
        if (start && end && end >= start) {
            let currentDay = new Date(start); let dayCount = 0; const MAX_DAYS_TO_CHECK = 31;
            while (currentDay <= end && dayCount < MAX_DAYS_TO_CHECK) {
                eventDays.add(currentDay.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase());
                currentDay.setDate(currentDay.getDate() + 1); dayCount++;
            }
        }
        if (eventDays.size > 0) {
            const preferredLower = vendor.schedule.preferredDays.map((d: string) => typeof d === 'string' ? d.toLowerCase() : '');
            const matches = preferredLower.filter((d: string) => d && eventDays.has(d));
            rawBreakdown.scheduleScore = (matches.length / preferredLower.length) * MAX_POINTS.SCHEDULE;
        }
    }

    // 7. Vendor Category Score (vendor.categories vs event.vendor_categories)
    if (Array.isArray(vendor.categories) && vendor.categories.length > 0 && Array.isArray(event.vendor_categories) && event.vendor_categories.length > 0) {
         const vendorCatsLower = vendor.categories.map(c => typeof c === 'string' ? c.toLowerCase() : '');
         const eventCatsLower = event.vendor_categories.map(ec => typeof ec === 'string' ? ec.toLowerCase() : '');
         const matches = vendorCatsLower.filter(vendorCat => vendorCat && eventCatsLower.includes(vendorCat));
         rawBreakdown.vendorCategoryScore = (matches.length / vendorCatsLower.length) * MAX_POINTS.VENDOR_CATEGORY;
     }

    // --- Apply Priority Factor Weights ---
    const weightedScores = { ...rawBreakdown }; // Copy raw scores to apply weights

    if (Array.isArray(vendor.eventPriorityFactors) && vendor.eventPriorityFactors.length > 0) {
        // Define weights (adjust these multipliers as needed)
        const weights = [1.5, 1.25, 1.1]; // Most important, 2nd, 3rd

        // Map priority strings to score keys
        const priorityMap: Record<string, keyof typeof rawBreakdown> = {
            "Expected Attendance & Event Size": "eventSizeScore",
            "Location": "locationScore",
            "Costs": "budgetScore",
            "Target Audience": "demographicsScore",
            // "Positive Host Reviews": "hostReviewScore", // Add when available
            "Vendor Count (Competition)": "eventSizeScore", // Also map to eventSizeScore
             // Add mappings for any other priority factors if needed
        };

        vendor.eventPriorityFactors.forEach((factor, index) => {
            if (index < weights.length) { // Only apply weights for top priorities
                const scoreKey = priorityMap[factor];
                if (scoreKey && typeof weightedScores[scoreKey] === 'number') {
                    // Apply the weight multiplier
                    weightedScores[scoreKey] *= weights[index];
                     // Optional: Cap weighted score at MAX_POINTS * weight to prevent excessive boosting?
                     // weightedScores[scoreKey] = Math.min(weightedScores[scoreKey], MAX_POINTS[scoreKey.replace('Score', '').toUpperCase()] * weights[index]);
                    console.log(`Applied weight ${weights[index]} to ${factor} (${scoreKey}), new score: ${weightedScores[scoreKey]}`);
                }
            }
        });
    }

    // --- Calculate Final Total Score ---
    // Sum the *weighted* scores
    const finalTotal = Object.values(weightedScores).reduce((sum, val) => sum + (val || 0), 0);

    // Normalize the weighted total back to a 0-100 scale (Optional but recommended)
    // Calculate the maximum possible weighted score based on priorities
    let maxPossibleWeightedScore = 0;
    const baseScoreKeys = Object.keys(MAX_POINTS) as Array<keyof typeof MAX_POINTS>;
    const weights = [1.5, 1.25, 1.1]; // Must match weights above
    const priorityMap: Record<string, keyof typeof rawBreakdown> = {
      "Expected Attendance & Event Size": "eventSizeScore",
      "Location": "locationScore",
      "Costs": "budgetScore",
      "Target Audience": "demographicsScore",
      "Vendor Count (Competition)": "eventSizeScore",
    };
    const appliedWeights: Partial<Record<keyof typeof rawBreakdown, number>> = {};
    if (Array.isArray(vendor.eventPriorityFactors)) {
        vendor.eventPriorityFactors.forEach((factor, index) => {
            if (index < weights.length) {
                const scoreKey = priorityMap[factor];
                if (scoreKey) {
                    // Store the highest weight if a key is prioritized multiple times
                    appliedWeights[scoreKey] = Math.max(appliedWeights[scoreKey] || 1, weights[index]);
                }
            }
        });
    }

    baseScoreKeys.forEach(baseKey => {
        const scoreKey = (baseKey.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase()) + 'Score') as keyof typeof rawBreakdown;
        const weight = appliedWeights[scoreKey] || 1; // Default weight is 1
        maxPossibleWeightedScore += MAX_POINTS[baseKey] * weight;
    });


    // Normalize finalTotal based on the max possible *weighted* score
    const normalizedTotal = maxPossibleWeightedScore > 0 ? (finalTotal / maxPossibleWeightedScore) * 100 : 0;


    // Return the detailed breakdown and the normalized total score
    return {
        ...weightedScores, // Return the weighted scores in the breakdown
        total: Math.round(normalizedTotal), // Return the normalized score (0-100)
        // Include other keys from ScoreBreakdown interface, setting them to 0
        pastEventScore: 0,
        headcountScore: 0,
        categoryScore: 0,
        vendorsNeededScore: 0,
        descriptionScore: 0,
     };
};


// --- API Route Handler (POST) ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId } = body;

    if (!vendorId) {
      console.log("RankEvents: Missing vendorId in request body.");
      return NextResponse.json({ error: "Vendor ID required" }, { status: 400 });
    }

    console.log(`RankEvents: Fetching vendor profile for vendorId: ${vendorId}`);
    const vendorSnap = await adminDb
      .collection("vendorProfile")
      .where("uid", "==", vendorId)
      .get();

    if (vendorSnap.empty) {
      console.error(`RankEvents: Vendor not found for vendorId: ${vendorId}`);
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    const vendor = vendorSnap.docs[0].data() as Vendor;
    console.log(`RankEvents: Vendor profile found for ${vendor.businessName || vendorId}`);

    console.log("RankEvents: Fetching formatted events...");
    const eventsSnap = await adminDb.collection("eventsFormatted").get();
    const events: EventFormatted[] = eventsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as EventFormatted));
    console.log(`RankEvents: Found ${events.length} formatted events.`);

    // --- Optional: Basic Pre-filtering (Recommended for Performance) ---
    const potentiallyRelevantEvents = events.filter(event => {
      if (Array.isArray(vendor.state) && vendor.state.length > 0 && event.location?.state) {
        if (!vendor.state.some(s => typeof s === 'string' && s.toLowerCase() === event.location.state.toLowerCase())) {
          return false;
        }
      }
      const SIXTY_DAYS_AGO = Date.now() - 60 * 24 * 60 * 60 * 1000;
      const endDateObj =
        event.endDate instanceof Timestamp
          ? event.endDate.toDate()
          : event.endDate
            ? new Date(event.endDate)
            : null;

      if (endDateObj && endDateObj.getTime() < SIXTY_DAYS_AGO) {
        // return false;
      }
      return true;
    });
    console.log(`RankEvents: ${potentiallyRelevantEvents.length} potentially relevant events after basic filtering.`);

    console.log(`RankEvents: Starting detailed scoring for ${potentiallyRelevantEvents.length} events...`);
    // Use the filtered list for scoring
    const ranked = potentiallyRelevantEvents.map(event => {
      const breakdown = calculateEventScore(vendor, event);
      return { ...event, score: breakdown.total, scoreBreakdown: breakdown };
    });

    // Sort by score descending
    ranked.sort((a, b) => b.score - a.score);
    console.log("RankEvents: Ranking complete.");

    return NextResponse.json({ rankedEvents: ranked });

  } catch (error) {
    console.error("Error in /api/rankEvents route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown server error occurred";
    // Provide more detail in server logs but keep client error message generic
    console.error("Error details:", error);
    return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
  }
}

// --- API Route Handler (GET) ---
export async function GET() {
  // Indicate that POST is the required method
  return NextResponse.json({ message: "Method Not Allowed. Use POST with vendorId in body to rank events." }, { status: 405 });
}