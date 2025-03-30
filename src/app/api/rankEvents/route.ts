import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Import Firestore setup
import { collection, getDocs, query, where } from "firebase/firestore";

import stringSimilarity from 'string-similarity';

interface Vendor {
  eventPreference?: string[];
  travelRadius?: number;
  coordinates: { lat: number; lng: number };
  budget?: {
    maxVendorFee?: number;
    totalCostEstimate?: number;
  };
  idealCustomer?: string;
  demographic?: string[];
  selectedPastPopups?: string[];
  schedule?: {
    preferredDays?: string[];
  };
  description?: string;
}

interface Event {
  type?: string;
  vendorFee?: number;
  totalCost?: number;
  attendeeType?: string[];
  demographics?: string[];
  name?: string;
  days?: string[];
  lat: number;
  lng: number;
  description?: string;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

const calculateEventScore = (vendor: any, event: any): number => {
  let score = 0;

  // Event type preference match
  if (vendor.eventPreference?.includes(event.type)) {
    score += 30;
  }

  // Travel distance match (more points the closer it is)
  if (
    typeof vendor.coordinates?.lat === "number" &&
    typeof vendor.coordinates?.lng === "number" &&
    typeof event.lat === "number" &&
    typeof event.lng === "number"
  ) {
    const distance = calculateDistance(
      vendor.coordinates.lat,
      vendor.coordinates.lng,
      event.lat,
      event.lng
    );
    const proximityScore = Math.max(0, 20 - distance * 0.2); // Reduce score the farther away
    score += proximityScore;
  }

  // Budget match
  if (
    vendor.budget?.maxVendorFee &&
    event.vendorFee &&
    event.vendorFee <= vendor.budget.maxVendorFee
  ) {
    score += 15;
  }

  // Customer type match
  if (vendor.idealCustomer && event.attendeeType?.includes(vendor.idealCustomer)) {
    score += 15;
  }

  // Demographic match
  if (
    vendor.demographic?.some((demo: string) =>
      event.demographics?.includes(demo)
    )
  ) {
    score += 10;
  }

  // Past event preference
  if (
    vendor.selectedPastPopups?.some(
      (pastEvent: string) => event.name === pastEvent
    )
  ) {
    score += 5;
  }

  // Preferred days match
// Preferred days match (convert event dates to weekday strings)
if (Array.isArray(event.dates) && Array.isArray(vendor.schedule?.preferredDays)) {
  const eventDaysOfWeek = event.dates.map((dateStr: string) => {
    const day = new Date(dateStr).toLocaleString("en-US", { weekday: "long" });
    return day;
  });

  const matches = vendor.schedule.preferredDays.filter((pref: string) =>
    eventDaysOfWeek.includes(pref)
  );

  if (matches.length > 0) {
    score += 5;
  }
}


  // Fallback to empty strings if descriptions are missing
  const vendorDescription = vendor.description ?? "";
  const eventDescription = event.description ?? "";

  // Semantic similarity of vendor & event descriptions
  const similarity = stringSimilarity.compareTwoStrings(
    vendorDescription.toLowerCase(),
    eventDescription.toLowerCase()
  );
  score += Math.floor(similarity * 10); // Max 10 points based on match strength

  return score;
};