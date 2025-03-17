import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase"; // Import Firestore setup
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

// Function to calculate event score (implement your logic here)
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { vendorId } = req.body;
    if (!vendorId) return res.status(400).json({ error: "Vendor ID is required" });

    // Fetch vendor profile
    const vendorDoc = await getDoc(doc(db, "vendors", vendorId));
    if (!vendorDoc.exists()) return res.status(404).json({ error: "Vendor not found" });
    const vendor = vendorDoc.data();

    // Fetch all events
    const eventsSnapshot = await getDocs(collection(db, "events"));
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    // Score each event
    const rankedEvents = events
      .map((event) => ({ ...event, score: calculateEventScore(vendor, event) }))
      .sort((a, b) => b.score - a.score);

    // Store ranked events in Firestore
    await setDoc(doc(db, "vendor_recommendations", vendorId), {
      recommendations: rankedEvents.slice(0, 20),
    });

    return res.status(200).json({ success: true, rankedEvents });
  } catch (error) {
    console.error("Error ranking events:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
