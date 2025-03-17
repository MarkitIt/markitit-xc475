import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Import Firestore setup
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

// Function to calculate event score (simplified for now)
const calculateEventScore = (vendor: any, event: any): number => {
  let score = 0;
  if (vendor.eventPreference.includes(event.type)) score += 30;
  const distance = Math.random() * 100; // Replace with actual distance calculation
  if (distance <= vendor.travelRadius) score += 20;
  if (event.vendorFee <= vendor.budget.maxVendorFee) score += 15;
  if (event.attendeeType.includes(vendor.idealCustomer)) score += 15;
  if (vendor.demographic.some((demo: string) => event.demographics.includes(demo))) score += 10;
  if (vendor.selectedPastPopups.some((pastEvent: string) => event.name === pastEvent)) score += 5;
  if (vendor.schedule.preferredDays.some((day: string) => event.days.includes(day))) score += 5;
  return score;
};

// Next.js App Router API Route
export async function POST(req: Request) {
  try {
    const { vendorId } = await req.json();
    if (!vendorId) return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });

    // Fetch vendor profile
    const vendorDoc = await getDoc(doc(db, "vendors", vendorId));
    if (!vendorDoc.exists()) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    const vendor = vendorDoc.data();

    // Fetch all events
    const eventsSnapshot = await getDocs(collection(db, "events"));
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    // Score events
    const rankedEvents = events
      .map((event) => ({ ...event, score: calculateEventScore(vendor, event) }))
      .sort((a, b) => b.score - a.score);

    // Store ranked events in Firestore
    await setDoc(doc(db, "vendor_recommendations", vendorId), {
      recommendations: rankedEvents.slice(0, 20),
    });

    return NextResponse.json({ success: true, rankedEvents });
  } catch (error) {
    console.error("Error ranking events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
