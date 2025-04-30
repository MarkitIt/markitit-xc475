import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import {
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { getGeminiClient, buildPrompt, cleanEventName } from "../../src/utils/gemini";
import { safeParseNumber } from "./parseEventsHelpers";
import { parseHeadcountRange } from "./parseEventsHelpers";
const db = admin.firestore();

const DEFAULT_MODEL_NAME = "gemini-1.5-pro";
const BACKUP_MODEL_NAME = "gemini-1.5-flash";
const VALID_MODEL_NAMES = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro",
  "gemini-pro",
  "gemini-2.0-flash",
];

interface EventInput {
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  date?: string;
}

async function formatEvents(event: EventInput, modelName = DEFAULT_MODEL_NAME) {
  if (!VALID_MODEL_NAMES.includes(modelName)) {
    console.warn(
      `⚠️ Model "${modelName}" not officially recognized. Trying anyway.`
    );
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: modelName,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  const prompt = buildPrompt(event);
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = await result.response.text();

  try {
    return JSON.parse(response);
  } catch (error) {
    const match = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    const roughMatch = response.match(/(\{[\s\S]*?\})/);
    if (roughMatch && roughMatch[1]) {
      return JSON.parse(roughMatch[1]);
    }
    console.error(`❌ Failed to parse Gemini response:`, response);
    throw new Error("Gemini output could not be parsed");
  }
}

export const onNewEventCreated = onDocumentCreated(
  "events/{eventId}",
  async (event) => {
    const eventId = event.params.eventId;
    const eventData = event.data?.data();

    if (!eventData) {
      console.error(`❌ No event data for ${eventId}`);
      return;
    }

    const description =
      eventData.description || eventData.demographics?.description;
    const city = eventData.location?.city;
    const state = eventData.location?.state;
    const name = eventData.name;

    if (!name || !description || !city || !state) {
      console.log(`⏩ Skipping event ${eventId} — missing required fields`);
      return;
    }

    // Check if already formatted
    const formattedDoc = await db
      .collection("eventsFormatted")
      .doc(eventId)
      .get();
    if (formattedDoc.exists) {
      console.log(`⏩ Event ${eventId} already formatted — skipping`);
      return;
    }

    console.log(`🚀 Processing new event: ${eventId} - "${name}"`);

    try {
      // Try default model
      let formattedData;
      try {
        formattedData = await formatEvents({
          name,
          description,
          location: { city, state },
          date: eventData.date,
        });
      } catch (error) {
        console.warn(
          `⚠️ Default model failed, trying backup model: ${
            (error as Error).message
          }`
        );
        formattedData = await formatEvents(
          {
            name,
            description,
            location: { city, state },
            date: eventData.date,
          },
          BACKUP_MODEL_NAME
        );
      }

      // Safe extract + parsing
      const num_vendors = safeParseNumber(formattedData.num_vendors);
      const estimated_headcount = safeParseNumber(
        formattedData.estimated_headcount
      );
      const { headcount_min, headcount_max } =
        parseHeadcountRange(estimated_headcount);

      await db
        .collection("eventsFormatted")
        .doc(eventId)
        .set({
          originalEventId: eventId,
          eventDataId: eventData.id || null,
          name: cleanEventName(name) || "",
          startDate: eventData.startDate || null,
          endDate: eventData.endDate || null,
          location: {
            city: city || "",
            state: state || "",
          },
          image: eventData.image || null,

          description: formattedData.description || "",
          booth_fees: formattedData.booth_fees || "N/A",
          category_tags: formattedData.category_tags || [],
          type: formattedData.type || "",
          demographic_guess: formattedData.demographic_guess || [],
          vendor_categories: formattedData.vendor_categories || [],
          num_vendors,
          estimated_headcount,
          headcount_min,
          headcount_max,

          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log(`✅ Successfully formatted and saved event ${eventId}`);
    } catch (error) {
      console.error(`❌ Failed to format and save event ${eventId}:`, error);
    }
  }
);
