import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

const db = admin.firestore();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODEL_NAME = "gemini-1.5-pro";

interface EventInput {
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  date?: string;
}

function buildPrompt(event: EventInput): string {
  return `
You are helping format web-scraped event data into a clean database.

Based ONLY on the input, output the following fields STRICTLY in JSON format:
---
- description: (2-3 sentences capturing the main event highlights)
- booth_fees: (mention vendor/booth fees; "N/A" if not known)
- category_tags: (Pick ONLY from: ["College pop-ups", "Indoor markets", "Outdoor festivals", "Holiday fairs", "Private corporate events", "Farmers markets", "Art fairs", "Seasonal markets", "Festival", "Other"]. Multiple allowed.)
- type: ("Food" or "Market")
- demographic_guess: (Select 3-5 likely audiences based on description)
- vendor_categories: (Pick 3-5 vendor types based on description)
- estimated_headcount: (Give best guess based on description or size words)

Respond ONLY with clean parsable JSON.

---
Event Info:
Name: ${event.name}
Location: ${event.location.city}, ${event.location.state}
Description: ${event.description}
Date(s): ${event.date || "N/A"}
---
`;
}

async function formatEvents(event: EventInput) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(event);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response.text();

  try {
    const parsed = JSON.parse(response);
    return parsed;
  } catch (error) {
    console.error("Error parsing Gemini response:", response);
    throw new Error("Failed to parse Gemini response as JSON");
  }
}

export const onNewEventCreated = functions.firestore
  .document("events/{eventId}")
  .onCreate(async (snap, context) => {
    const eventId = context.params.eventId;
    const eventData = snap.data();

    if (!eventData) {
      console.error("No event data found.");
      return;
    }

    // Check if event already formatted
    const formattedDoc = await db.collection("formattedEvents").doc(eventId).get();
    if (formattedDoc.exists) {
      console.log(`Event ${eventId} already formatted. Skipping.`);
      return;
    }

    try {
      const formatted = await formatEvents({
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        date: eventData.date,
      });

      await db.collection("formattedEvents").doc(eventId).set({
        originalEventId: eventId,
        ...formatted,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Formatted event ${eventId} successfully.`);
    } catch (error) {
      console.error(`Failed to format event ${eventId}:`, error);
    }
  });
