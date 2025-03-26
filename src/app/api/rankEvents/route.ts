import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Import Firestore setup
import { collection, getDocs, query, where } from "firebase/firestore";

// Function to calculate event score (simplified for now)
const calculateEventScore = (vendor: any, event: any): number => {
  let score = 0;

  // Check if properties exist before using them
  if (vendor.eventPreference?.includes(event.type)) {
    score += 30;
  }

  const distance = Math.random() * 100; // Replace with actual calculation
  if (vendor.travelRadius && distance <= vendor.travelRadius) {
    score += 20;
  }

  if (vendor.budget?.maxVendorFee && event.vendorFee && 
      event.vendorFee <= vendor.budget.maxVendorFee) {
    score += 15;
  }

  if (vendor.idealCustomer && event.attendeeType?.includes(vendor.idealCustomer)) {
    score += 15;
  }

  if (vendor.demographic?.some((demo: string) => 
      event.demographics?.includes(demo))) {
    score += 10;
  }

  if (vendor.selectedPastPopups?.some((pastEvent: string) => 
      event.name === pastEvent)) {
    score += 5;
  }

  if (vendor.schedule?.preferredDays?.some((day: string) => 
      event.days?.includes(day))) {
    score += 5;
  }

  return score;
};

// Next.js App Router API Route
export async function POST(req: Request) {
  try {
    const { vendorId } = await req.json();
    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
    }

    // Fetch vendor profile
    const vendorProfileRef = collection(db, "vendorProfile");
    const q = query(vendorProfileRef, where("uid", "==", vendorId));
    const vendorSnapshot = await getDocs(q);
    
    if (vendorSnapshot.empty) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    const vendor = vendorSnapshot.docs[0].data();
   // console.log(vendor);
    // Fetch all events
    const eventsSnapshot = await getDocs(collection(db, "events"));
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Score and rank events
    const rankedEvents = events
      .map(event => ({
        ...event,
        score: calculateEventScore(vendor, event)
      }))
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ success: true, rankedEvents });
  } catch (error) {
    console.error("Error ranking events:");
    //console.error("Error ranking events:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
