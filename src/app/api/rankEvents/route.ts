import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import stringSimilarity from "string-similarity";
import {parseEventDate } from "@/utils/inferEventData";
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
  vendorsNeededScore: number;
  descriptionScore: number;
  total: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (deg: number) => deg * (Math.PI / 180);
  const R = 3958.8; // Miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateEventScore = async (vendor: any, event: any): Promise<ScoreBreakdown> => {
  const rawBreakdown = {
    eventTypeScore: 0,
    locationScore: 0,
    budgetScore: 0,
    demographicsScore: 0,
    pastEventScore: 0,
    headcountScore: 0,
    daysScore: 0,
    categoryScore: 0,
    vendorsNeededScore: 0,
    descriptionScore: 0,
  };

  if (vendor.eventPreference && event.type) {
    const matches = vendor.eventPreference.filter((t: string) => event.type.includes(t));
    rawBreakdown.eventTypeScore = (matches.length / vendor.eventPreference.length) * 10;
  }

  if (vendor.cities?.includes(event.location?.city)) {
    rawBreakdown.locationScore = 15;
  }

  const totalEventCost = (event.vendorFee || 0) + (event.applicationFee || 0);
  if (vendor.budget?.maxVendorFee) {
    if (totalEventCost <= vendor.budget.maxVendorFee) {
      rawBreakdown.budgetScore = 15;
    } else {
      const diff = totalEventCost - vendor.budget.maxVendorFee;
      const percentOver = diff / vendor.budget.maxVendorFee;
      rawBreakdown.budgetScore = Math.max(0, 15 - percentOver * 15);
    }
  }

  if (vendor.demographic && event.demographics) {
    const overlap = vendor.demographic.filter((demo: string) => event.demographics.includes(demo));
    rawBreakdown.demographicsScore = Math.min(15, overlap.length * 5);
  }

  if (vendor.selectedPastPopups?.includes(event.name)) {
    rawBreakdown.pastEventScore = 5;
  }

  if (vendor.preferredEventSize?.min && vendor.preferredEventSize?.max && typeof event.numVendors === "number") {
    const size = event.numVendors;
    if (size >= vendor.preferredEventSize.min && size <= vendor.preferredEventSize.max) {
      rawBreakdown.headcountScore = 5;
    } else if (Math.abs(size - vendor.preferredEventSize.min) <= 10 || Math.abs(size - vendor.preferredEventSize.max) <= 10) {
      rawBreakdown.headcountScore = 3;
    }
  }

  if (event.startDate && event.endDate && Array.isArray(vendor.schedule?.preferredDays)) {
    const days = new Set<string>();
    for (let d = new Date(event.startDate.seconds * 1000); d <= new Date(event.endDate.seconds * 1000); d.setDate(d.getDate() + 1)) {
      days.add(d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase());
    }
    const matches = vendor.schedule.preferredDays.map((d: string) => d.toLowerCase()).filter((d: string) => days.has(d));
    rawBreakdown.daysScore = (matches.length / days.size) * 10;
  }

  if (vendor.categories && event.categories) {
    const matched = vendor.categories.some((cat: string) => event.categories.includes(cat));
    if (matched) rawBreakdown.categoryScore = 15;
  }

  if (vendor.categories && event.vendorsNeeded) {
    const matched = vendor.categories.some((cat: string) => event.vendorsNeeded.includes(cat));
    if (matched) rawBreakdown.vendorsNeededScore = 5;
  }

  const descSimilarity = stringSimilarity.compareTwoStrings(
    (vendor.description || "").toLowerCase(),
    (event.description || "").toLowerCase()
  );
  rawBreakdown.descriptionScore = Math.floor(descSimilarity * 5);

  const priorityWeights: Record<string, keyof typeof rawBreakdown> = {
    "Event Theme": "eventTypeScore",
    "Location": "locationScore",
    "Costs": "budgetScore",
    "Target Audience": "demographicsScore",
    "Past Event Reviews": "pastEventScore",
    "Competition Level": "headcountScore",
    "Event Duration": "daysScore",
    "Expected Attendance": "headcountScore",
    "Vendor Count (Competition)": "headcountScore",
    "Marketing Support": "vendorsNeededScore",
    "Expected Attendance & Event Size": "headcountScore",
  };

  const weights = vendor.eventPriorityFactors || [];
  const multiplier = 1 + weights.length * 0.05;
  const weightedBreakdown = { ...rawBreakdown };

  weights.forEach((factor: string) => {
    const key = priorityWeights[factor];
    if (key && weightedBreakdown[key] !== undefined) {
      weightedBreakdown[key] *= multiplier;
    }
  });

  const total = Object.values(weightedBreakdown).reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0);

  return { ...weightedBreakdown, total };
};

export async function POST(request: Request) {
  const body = await request.json();
  const { vendorId } = body;
  if (!vendorId) return NextResponse.json({ error: "Vendor ID required" }, { status: 400 });

  const vendorSnap = await getDocs(query(collection(db, "vendorProfile"), where("uid", "==", vendorId)));
  if (vendorSnap.empty) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  const vendor = vendorSnap.docs[0].data() as Vendor;

  const eventsSnap = await getDocs(collection(db, "events"));
  const events = await Promise.all(
    eventsSnap.docs.map(async (doc) => {
      const data = doc.data();
      const parsed = parseEventDate(data.date || data.detailed_date);
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate || parsed.startDate,
        endDate: data.endDate || parsed.endDate,
      };
    })
  );

  const ranked = await Promise.all(
    events.map(async (event) => {
      const breakdown = await calculateEventScore(vendor, event);
      return { ...event, score: breakdown.total, scoreBreakdown: breakdown };
    })
  );

  ranked.sort((a, b) => b.score - a.score);
  return NextResponse.json({ rankedEvents: ranked });
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to rank events" }, { status: 405 });
}