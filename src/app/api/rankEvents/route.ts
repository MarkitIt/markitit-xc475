import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Import Firestore setup
import { collection, getDocs, query, where } from "firebase/firestore";
import stringSimilarity from "string-similarity";
import {
  getLatLongFromCityState,
  getCityState,
  parseEventDate,
} from "@/utils/inferEventData";
import { Event } from "@/types/Event";
import { Vendor } from "@/types/Vendor";

interface ScoreBreakdown {
  eventTypeScore: number;
  locationScore: number;
  budgetScore: number;
  demographicsScore: number;
  pastEventScore: number;
  headcountScore: number;
  daysScore: number;
  categoryScore: number;
  descriptionScore: number;
  total: number;
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 3958.8; // Miles

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate category score - Max 20 points
const calculateCategoryScore = (vendor: any, event: any): number => {
  let score = 0;

  if (event.categories && vendor.categories) {
    if (event.categories.includes("All")) {
      score += 20;
    } else if (
      vendor.categories.some((category: string) =>
        event.categories.includes(category),
      )
    ) {
      score += 20;
    }
  }

  return score;
};

// Helper function to get weekday from Firestore timestamp
const getWeekdayFromTimestamp = (timestamp: {
  seconds: number;
  nanoseconds: number;
}): string => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString("en-US", { weekday: "long" });
};

const calculateEventScore = async (
  vendor: any,
  event: any,
): Promise<ScoreBreakdown> => {
  const breakdown: ScoreBreakdown = {
    eventTypeScore: 0,
    locationScore: 0,
    budgetScore: 0,
    demographicsScore: 0,
    pastEventScore: 0,
    headcountScore: 0,
    daysScore: 0,
    categoryScore: 0,
    descriptionScore: 0,
    total: 0,
  };

  // Ensure both vendor preferences and event types exist
  if (vendor.eventPreference?.length > 0 && event.type?.length > 0) {
    let matchedTypes = vendor.eventPreference.filter((type: string) =>
      event.type.includes(type),
    ).length;
    let totalPreferences = vendor.eventPreference.length;

    // Normalize score based on percentage of matches - Max 20 points
    breakdown.eventTypeScore = (matchedTypes / totalPreferences) * 20;
  } else {
    breakdown.eventTypeScore = 0;
  }

  // Get coordinates from event location if available
  let eventCoordinates = { lat: 0, lng: 0 };
  if (event.location?.city && event.location?.state) {
    eventCoordinates = (await getLatLongFromCityState(
      event.location.city,
      event.location.state,
    )) || { lat: 0, lng: 0 };
  }

  // Travel distance match - Max 20 points
  if (
    typeof vendor.coordinates?.lat === "number" &&
    typeof vendor.coordinates?.lng === "number" &&
    typeof eventCoordinates?.lat === "number" &&
    typeof eventCoordinates?.lng === "number" &&
    eventCoordinates.lat !== 0 &&
    eventCoordinates.lng !== 0
  ) {
    // Ensure longitude is handled correctly (negative for western hemisphere)
    const vendorLng = vendor.coordinates.lng;
    const eventLng = eventCoordinates.lng;

    // Calculate distance
    const distance = calculateDistance(
      vendor.coordinates.lat,
      vendorLng,
      eventCoordinates.lat,
      eventLng,
    );

    // More lenient distance scoring - Max 20 points
    // 0 points at 200 miles or more (0.1 point per mile)
    breakdown.locationScore = Math.max(0, 20 - distance * 0.1);
  }

  // Budget match - Max 15 points
  if (
    vendor.budget?.maxVendorFee &&
    event.vendorFee &&
    event.vendorFee <= vendor.budget.maxVendorFee
  ) {
    breakdown.budgetScore = 15;
  }

  // Demographic match - Max 15 points
  if (
    vendor.demographic?.some((demo: string) =>
      event.demographics?.includes(demo),
    )
  ) {
    breakdown.demographicsScore = 15;
  }

  // Past event preference - Max 5 points
  if (
    vendor.selectedPastPopups?.some(
      (pastEvent: string) => event.name === pastEvent,
    )
  ) {
    breakdown.pastEventScore = 5;
  }

  // Headcount match - Max 5 points
  if (
    vendor.preferredEventSize?.min &&
    vendor.preferredEventSize?.max &&
    event.headcount
  ) {
    const preferredMin = vendor.preferredEventSize.min;
    const preferredMax = vendor.preferredEventSize.max;
    const eventSize = event.headcount;

    if (eventSize >= preferredMin && eventSize <= preferredMax) {
      breakdown.headcountScore = 5;
    } else {
      const distanceToRange = Math.min(
        Math.abs(eventSize - preferredMin),
        Math.abs(eventSize - preferredMax),
      );

      if (distanceToRange <= 100) {
        breakdown.headcountScore = 3;
      } else if (distanceToRange <= 300) {
        breakdown.headcountScore = 2;
      } else if (distanceToRange <= 500) {
        breakdown.headcountScore = 1;
      }
    }
  }

  // Preferred days match - Max 5 points NOT WORKING
  if (
    event.startDate &&
    event.endDate &&
    Array.isArray(vendor.schedule?.preferredDays)
  ) {
    const start = new Date(event.startDate.seconds * 1000);
    const end = new Date(event.endDate.seconds * 1000);
    const eventDays = new Set<string>();

    // Loop through each day between start and end date
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      eventDays.add(d.toLocaleString("en-US", { weekday: "long" }));
    }

    // Debug logging
    console.log("Vendor preferred days:", vendor.schedule.preferredDays);
    console.log("Event days:", Array.from(eventDays));

    // Normalize day formats for comparison (prevent case sensitivity issues)
    const normalizedPreferredDays = vendor.schedule.preferredDays.map(
      (day: string) => day.toLowerCase(),
    );
    const normalizedEventDays = Array.from(eventDays).map((day: string) =>
      day.toLowerCase(),
    );

    console.log("Normalized vendor days:", normalizedPreferredDays);
    console.log("Normalized event days:", normalizedEventDays);

    // Count matching days (case insensitive)
    const matches = normalizedPreferredDays.filter((day: string) =>
      normalizedEventDays.includes(day),
    ).length;

    // Alternative approach if there are still issues - check partial matches
    if (matches === 0) {
      console.log("No exact matches found, checking partial matches...");
      for (const vendorDay of normalizedPreferredDays) {
        for (const eventDay of normalizedEventDays) {
          if (eventDay.includes(vendorDay) || vendorDay.includes(eventDay)) {
            console.log(
              `Partial match found: ${vendorDay} matches with ${eventDay}`,
            );
          }
        }
      }
    }

    console.log("Matches found:", matches);
    console.log("Total event days:", eventDays.size);

    // Scale score based on match percentage
    // Make sure we have at least some event days before division
    if (eventDays.size > 0) {
      breakdown.daysScore = (matches / eventDays.size) * 5;
    } else {
      breakdown.daysScore = 0;
    }
    console.log("Final days score:", breakdown.daysScore);
  }

  // Category score - Max 20 points
  breakdown.categoryScore = calculateCategoryScore(vendor, event);

  // Description similarity - Max 5 points
  const vendorDescription = vendor.description ?? "";
  const eventDescription = event.description ?? "";
  const similarity = stringSimilarity.compareTwoStrings(
    vendorDescription.toLowerCase(),
    eventDescription.toLowerCase(),
  );
  breakdown.descriptionScore = Math.floor(similarity * 5);

  // Calculate total
  breakdown.total = Object.values(breakdown).reduce(
    (sum, score) => (score === breakdown.total ? sum : sum + score),
    0,
  );

  console.log(`Event ${event.name} - Score breakdown:`, breakdown);
  console.log(`Total score: ${breakdown.total}`);

  return breakdown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vendorId } = body;

    if (!vendorId) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 },
      );
    }

    // Log vendor ID being used for ranking
    console.log("🔍 Ranking events for vendor ID:", vendorId);

    // Get vendor profile
    const vendorRef = collection(db, "vendorProfile");
    const vendorDoc = await getDocs(
      query(vendorRef, where("uid", "==", vendorId)),
    );

    if (vendorDoc.empty) {
      console.log("❌ No vendor profile found for vendorId:", vendorId);
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    console.log("✅ Vendor profile found for vendorId:", vendorId);

    // Get vendor profile data
    const vendor = vendorDoc.docs[0].data() as Vendor;

    // Log vendor information for debugging
    console.log("🧩 Vendor profile data:", {
      uid: vendor.uid,
      categories: vendor.categories,
      coordinates: vendor.coordinates,
      eventPreference: vendor.eventPreference,
      schedule: vendor.schedule?.preferredDays,
    });

    // Get all events from Firestore
    const eventsRef = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsRef);

    if (eventsSnapshot.empty) {
      return NextResponse.json({ rankedEvents: [] });
    }

    const events = await Promise.all(
      eventsSnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Extract coordinates by parsing data.coordinates
        let coordinates = { lat: 0, lng: 0 };

        // Check if coordinates is an object with lat and lng nested properties
        if (data.coordinates && typeof data.coordinates === "object") {
          // Access lat and lng from the "coordinates" object
          if ("lat" in data.coordinates && "lng" in data.coordinates) {
            coordinates = {
              lat: Number(data.coordinates.lat),
              lng: Number(data.coordinates.lng),
            };
          }
        }
        // For flat structure (lat and lng directly in data)
        else if ("lat" in data && "lng" in data) {
          coordinates = {
            lat: Number(data.lat),
            lng: Number(data.lng),
          };
        }

        // Handle date fields - prioritize existing dates or parse from detailed_date
        let startDate = data.startDate;
        let endDate = data.endDate;

        // If there's a detailed_date and missing start/end dates, parse it
        if (data.detailed_date && (!startDate || !endDate)) {
          const parsedDates = parseEventDate(data.detailed_date);
          startDate = parsedDates.startDate || startDate;
          endDate = parsedDates.endDate || endDate;
        }

        return {
          id: doc.id,
          type: data.type,
          vendorFee: data.vendorFee,
          totalCost: data.totalCost,
          attendeeType: data.attendeeType,
          headcount: data.headcount,
          demographics: data.demographics,
          name: data.name,
          startDate: startDate,
          endDate: endDate,
          description: data.description,
          categories: data.categories,
          location: data.location,
          image: data.image || "",
        } as Event;
      }),
    );

    const rankedEvents = await Promise.all(
      events.map(async (event) => {
        const scoreBreakdown = await calculateEventScore(vendor, event);

        // Make sure we're returning the raw score, not divided by anything
        const rawScore = scoreBreakdown.total;
        console.log(`Event ${event.name} raw score: ${rawScore}`);

        return {
          ...event,
          score: rawScore,
          scoreBreakdown: scoreBreakdown,
        };
      }),
    );

    // Sort by score in descending order
    rankedEvents.sort((a, b) => b.score - a.score);

    console.log("Final ranked events with scores:");
    rankedEvents.slice(0, 5).forEach((event) => {
      console.log(`Event: ${event.name}, Final Score: ${event.score}`);
    });

    return NextResponse.json({ rankedEvents });
  } catch (error) {
    console.error("Error ranking events:", error);
    return NextResponse.json(
      { error: "Failed to rank events" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST method to rank events" },
    { status: 405 },
  );
}
