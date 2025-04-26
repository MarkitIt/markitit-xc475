import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { DocumentSnapshot, DocumentData } from "firebase-admin/firestore";

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(
  functions.config().gemini?.api_key || process.env.GEMINI_API_KEY || ""
);
const DEFAULT_MODEL_NAME = "gemini-1.5-pro";

// List of valid model names to check against
const VALID_MODEL_NAMES = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro", 
  "gemini-pro",
  "gemini-2.0-flash"  // Adding the model name from the dashboard
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

function buildPrompt(event: EventInput): string {
  return `
You are helping format web-scraped event data into a clean database.

Based ONLY on the input, output the following fields STRICTLY in JSON format:
---
- description
- booth_fees
- category_tags
- type
- demographic_guess
- vendor_categories
- estimated_headcount

Make sure to return a valid JSON object that can be parsed with JSON.parse().
Format your entire response as a JSON object with no additional text, explanation, or markdown.
Just the raw JSON object is required.

---
Event Info:
Name: ${event.name}
Location: ${event.location.city}, ${event.location.state}
Description: ${event.description}
Date(s): ${event.date || "N/A"}
---
`;
}

async function formatEventWithGemini(event: EventInput, modelName: string) {
  try {
    // Check if model exists in the list of valid models
    if (!VALID_MODEL_NAMES.includes(modelName)) {
      console.warn(`Warning: Model "${modelName}" not in list of known models. Attempting to use anyway.`);
    }
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Test if the model is available
    console.log(`Sending request to Gemini model: ${modelName} for event: ${event.name}`);
    const prompt = buildPrompt(event);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = await result.response.text();
    console.log(`Received response from Gemini for event: ${event.name}`);
    
    // Try to clean up the response for parsing
    try {
      // First attempt: direct parsing
      try {
        const parsed = JSON.parse(response);
        return parsed;
      } catch (e) {
        // Second attempt: try to extract JSON from possible markdown code block
        const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          const extractedJson = jsonMatch[1].trim();
          return JSON.parse(extractedJson);
        }
        
        // Third attempt: find anything that looks like a JSON object
        const possibleJson = response.match(/(\{[\s\S]*\})/);
        if (possibleJson && possibleJson[1]) {
          return JSON.parse(possibleJson[1]);
        }
        
        // If we got here, we couldn't parse it
        throw new Error(`Failed to parse Gemini response as JSON. Raw response: ${response.substring(0, 200)}...`);
      }
    } catch (error) {
      console.error("Error parsing Gemini response as JSON:", response);
      throw new Error(`Failed to parse Gemini response as JSON: ${response.substring(0, 200)}...`);
    }
  } catch (error) {
    console.error(`Error using Gemini API with model ${modelName}:`, error);
    throw new Error(`Gemini API error with model ${modelName}: ${(error as Error).message}`);
  }
}

export const batchFormatEvents = functions
  .runWith({
    timeoutSeconds: 540, // Max 9 minutes
    memory: "2GB",
  })
  .https.onRequest(async (req, res) => {
    try {
      console.log("➡️ Starting batch format of events");
      console.log(`Request params: ${JSON.stringify(req.query)}`);
      
      let docsToProcess: DocumentSnapshot<DocumentData>[] = [];
      let totalEvents = 0;
      let processed = 0;
      let skipped = 0;
      let formatted = 0;
      const debugLogs: string[] = [];
      
      // Helper function to add debug logs
      const addDebugLog = (message: string) => {
        console.log(message);
        debugLogs.push(message);
      };
      
      // Check if debug mode is enabled
      const debugMode = req.query.debug === 'true';
      
      // Check if force updating is enabled
      const forceUpdate = req.query.force === 'true';
      if (forceUpdate) {
        addDebugLog("🔄 Force update enabled - will reformat events even if already formatted");
      }
      
      // Get the model name from query or use default
      const modelName = (req.query.modelName as string) || DEFAULT_MODEL_NAME;
      addDebugLog(`🤖 Using Gemini model: ${modelName}`);
      
      // Check API key status
      addDebugLog(`🔑 API Key status: ${functions.config().gemini?.api_key ? "Configured in Firebase Config" : 
        (process.env.GEMINI_API_KEY ? "Using environment variable" : "NOT SET - API calls will fail")}`);
      
      // Check if specific event ID was provided
      if (req.query.eventId) {
        const eventId = req.query.eventId as string;
        console.log(`🎯 Processing single event with ID: ${eventId}`);
        
        // First try to find by document ID
        const doc = await db.collection("events").doc(eventId).get();
        
        if (doc.exists) {
          docsToProcess = [doc];
          totalEvents = 1;
          console.log(`✅ Found event with document ID: ${eventId}`);
        } else {
          // If not found by document ID, try to find by the 'id' field
          console.log(`⚠️ Event not found by document ID, trying to find by 'id' field: ${eventId}`);
          const querySnapshot = await db.collection("events")
            .where("id", "==", eventId)
            .get();
            
          if (!querySnapshot.empty) {
            docsToProcess = querySnapshot.docs;
            totalEvents = querySnapshot.size;
            console.log(`✅ Found ${querySnapshot.size} event(s) with id field: ${eventId}`);
          } else {
            // If still not found, try finding by name
            console.log(`⚠️ Event not found by 'id' field, trying to find by name: ${eventId}`);
            const nameQuerySnapshot = await db.collection("events")
              .where("name", "==", eventId)
              .get();
              
            if (!nameQuerySnapshot.empty) {
              docsToProcess = nameQuerySnapshot.docs;
              totalEvents = nameQuerySnapshot.size;
              console.log(`✅ Found ${nameQuerySnapshot.size} event(s) with name: ${eventId}`);
            } else {
              console.error(`❌ Event ID ${eventId} not found in database by document ID, 'id' field, or name`);
              res.status(404).send({ 
                error: `Event ID ${eventId} not found`,
                success: false 
              });
              return;
            }
          }
        }
      } else {
        console.log("📋 Processing multiple events");
        const eventsSnapshot = await db.collection("events").get();
        totalEvents = eventsSnapshot.size;
        docsToProcess = eventsSnapshot.docs;
        
        // Optional limit
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        if (limit) {
          docsToProcess = docsToProcess.slice(0, limit);
          console.log(`⚡ Limited to ${limit} events out of ${totalEvents} total events`);
          totalEvents = limit;
        } else {
          console.log(`📊 Processing all ${totalEvents} events`);
        }
      }

      // Process each document
      for (const doc of docsToProcess) {
        const eventId = doc.id;
        const eventData = doc.data() || {};
        const eventName = eventData.name || 'Unnamed event';
        addDebugLog(`🔄 Processing event: ${eventId} - "${eventName}"`);
        addDebugLog(`📋 Event data: ${JSON.stringify({
          name: eventData.name,
          description: eventData.description || eventData.demographics?.description,
          location: eventData.location,
          date: eventData.date
        }, null, 2)}`);

        const description = eventData.description || eventData.demographics?.description;
        const city = eventData.location?.city;
        const state = eventData.location?.state;

        // Log check for each field
        addDebugLog(`🔍 Field check:
          name: ${Boolean(eventData.name)}
          description: ${Boolean(description)}
          city: ${Boolean(city)}
          state: ${Boolean(state)}
        `);

        if (!eventData.name || !description || !city || !state) {
          addDebugLog(`⏩ Skipping event ${eventId}: missing required fields`);
          if (!eventData.name) addDebugLog(`   Missing: name`);
          if (!description) addDebugLog(`   Missing: description`);
          if (!city) addDebugLog(`   Missing: city`);
          if (!state) addDebugLog(`   Missing: state`);
          
          skipped++;
          continue;
        }

        // Check if already formatted (unless force update is enabled)
        if (!forceUpdate) {
          const formattedDoc = await db.collection("formattedEvents").doc(eventId).get();
          if (formattedDoc.exists) {
            addDebugLog(`⏩ Skipping event ${eventId}: already formatted (use force=true to reformat)`);
            skipped++;
            continue;
          } else {
            addDebugLog(`✓ Event ${eventId} not found in formattedEvents collection, proceeding with formatting`);
          }
        } else if (forceUpdate) {
          addDebugLog(`🔄 Force updating event ${eventId} even though it may already be formatted`);
        }

        try {
          addDebugLog(`🤖 Sending event ${eventId} to Gemini for formatting...`);
          addDebugLog(`API Key status: ${functions.config().gemini?.api_key ? "Set in Firebase Config" : 
            (process.env.GEMINI_API_KEY ? "Set in environment variable" : "NOT SET - API calls will fail")}`);
          
          const formattedData = await formatEventWithGemini({
            name: eventData.name,
            description,
            location: { city, state },
            date: eventData.date || undefined,
          }, (req.query.modelName as string) || DEFAULT_MODEL_NAME);
          
          addDebugLog(`✅ Received formatted data from Gemini: ${JSON.stringify(formattedData, null, 2)}`);

          await db.collection("formattedEvents").doc(eventId).set({
            originalEventId: eventId,
            ...formattedData,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });

          addDebugLog(`✅ Successfully formatted event ${eventId}`);
          formatted++;
        } catch (error) {
          addDebugLog(`❌ Failed to format event ${eventId}: ${(error as Error).message}`);
          skipped++;
        }

        processed++;
        
        // Progress update every 5 events (or every event if less than 5 total)
        if (processed % 5 === 0 || processed === totalEvents) {
          console.log(`📊 Progress: ${processed}/${totalEvents} (${Math.round(processed/totalEvents*100)}%) - Formatted: ${formatted}, Skipped: ${skipped}`);
        }
        
        // Slow down to avoid rate limits
        await sleep(500);
      }

      console.log(`🏁 Batch formatting complete: ${processed} processed, ${formatted} formatted, ${skipped} skipped`);
      
      // Include debug logs in response if debug mode is enabled
      const response: any = {
        message: "Batch formatting complete",
        totalEvents,
        processed,
        formatted,
        skipped,
        success: true
      };
      
      if (debugMode) {
        response.debug = {
          logs: debugLogs,
          configStatus: {
            geminiApiKeySet: !!functions.config().gemini?.api_key,
            envApiKeySet: !!process.env.GEMINI_API_KEY,
            modelName: modelName
          }
        };
      }
      
      res.status(200).send(response);
    } catch (error) {
      console.error("❌ Error in batch formatting:", error);
      res.status(500).send({ 
        error: (error as Error).message,
        success: false 
      });
    }
  });