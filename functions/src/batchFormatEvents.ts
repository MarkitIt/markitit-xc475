import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { Request, Response } from "express";
import { getGeminiClient, buildPrompt, cleanEventName } from "../../src/utils/gemini";
import { safeParseNumber, parseHeadcountRange } from "./parseEventsHelpers";
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

const db = admin.firestore();

const DEFAULT_MODEL_NAME = "gemini-1.5-pro";
const VALID_MODEL_NAMES = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro",
  "gemini-pro",
  "gemini-2.0-flash",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface EventInput {
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  date?: string;
}

async function formatEvent(
  event: EventInput,
  modelName = DEFAULT_MODEL_NAME
) {
  if (!VALID_MODEL_NAMES.includes(modelName)) {
    console.warn(`⚠️ Model "${modelName}" not recognized. Trying anyway.`);
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
  } catch (e) {
    const match = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    const roughMatch = response.match(/(\{[\s\S]*?\})/);
    if (roughMatch && roughMatch[1]) {
      return JSON.parse(roughMatch[1]);
    }
    console.error(`❌ Failed to parse Gemini output:`, response);
    throw new Error("Failed to parse Gemini output");
  }
}

export const batchFormatEvents = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB"
  })
  .https.onRequest(async (req: Request, res: Response) => {
    try {
      console.log("🚀 Starting batch event formatting...");

      const eventId = req.query.eventId as string | undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const modelName = (req.query.modelName as string) || DEFAULT_MODEL_NAME;
      const forceUpdate = req.query.force === "true";

      let docsToProcess: (DocumentSnapshot | QueryDocumentSnapshot)[] = [];

      if (eventId) {
        const doc = await db.collection("events").doc(eventId).get();
        if (doc.exists) {
          docsToProcess = [doc];
        } else {
          const altQuery = await db
            .collection("events")
            .where("id", "==", eventId)
            .get();
          if (!altQuery.empty) {
            docsToProcess = altQuery.docs;
          } else {
            throw new Error(`Event ID ${eventId} not found`);
          }
        }
      } else {
        const snapshot = await db.collection("events").get();
        docsToProcess = limit ? snapshot.docs.slice(0, limit) : snapshot.docs;
      }

      console.log(`📋 Found ${docsToProcess.length} events to process.`);

      let processed = 0;
      let formatted = 0;
      let skipped = 0;

      for (const doc of docsToProcess) {
        const eventData = doc.data();
        if (!eventData) {
          console.log(`⏩ Skipping event ${doc.id} — no data`);
          skipped++;
          continue;
        }
        const eventDocId = doc.id;

        const description =
          eventData.description || eventData.demographics?.description;
        const city = eventData.location?.city;
        const state = eventData.location?.state;
        const name = eventData.name;

        if (!name || !description || !city || !state) {
          console.log(`⏩ Skipping event ${eventDocId} — missing fields`);
          skipped++;
          continue;
        }

        const formattedDoc = await db
          .collection("eventsFormatted")
          .doc(eventDocId)
          .get();
        if (formattedDoc.exists && !forceUpdate) {
          console.log(`⏩ Skipping already formatted event: ${eventDocId}`);
          skipped++;
          continue;
        }

        try {
          const formattedData = await formatEvent(
            {
              name,
              description,
              location: { city, state },
              date: eventData.date,
            },
            modelName
          );

          const num_vendors = safeParseNumber(formattedData.num_vendors);
          const estimated_headcount = safeParseNumber(
            formattedData.estimated_headcount
          );

          const { headcount_min, headcount_max } =
            parseHeadcountRange(estimated_headcount);

          await db
            .collection("eventsFormatted")
            .doc(eventDocId)
            .set({
              originalEventId: eventDocId,
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
              application_fee: formattedData.application_fee || null,

              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })
            .then(() => {
              console.log(`✅ Successfully saved to eventsFormatted collection for event ${eventDocId}`);
              console.log(`Document path: eventsFormatted/${eventDocId}`);
            })
            .catch((error) => {
              console.error(`❌ Failed to save to eventsFormatted collection for event ${eventDocId}:`, error);
              throw error;
            });
          formatted++;
        } catch (error) {
          console.error(`❌ Failed to format event ${eventDocId}`, error);
          skipped++;
        }

        processed++;
        await sleep(500);
      }

      console.log(
        `🏁 Batch complete: ${processed} processed, ${formatted} formatted, ${skipped} skipped.`
      );

      res.status(200).send({
        message: "Batch formatting complete",
        totalEvents: docsToProcess.length,
        processed,
        formatted,
        skipped,
      });
    } catch (error) {
      console.error("❌ Error during batch format:", error);
      res.status(500).send({ error: (error as Error).message });
    }
  });
