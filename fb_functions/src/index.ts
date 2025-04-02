/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Import v1 functions for Firestore triggers (v2 is imported separately)
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { DateTime } from 'luxon';

// Import v2 functions for HTTP triggers
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import v1 functions specifically
import { defineString, defineInt } from 'firebase-functions/params';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const db = admin.firestore();

// Helper function to convert Date to Firestore Timestamp
function toFirebaseTimestamp(date: Date | null): admin.firestore.Timestamp | null {
  return date ? admin.firestore.Timestamp.fromDate(date) : null;
}

// The parseEventDate function (similar to the one in your utils)
function parseEventDate(detailedDate: string): { 
  startDate: admin.firestore.Timestamp | null; 
  endDate: admin.firestore.Timestamp | null 
} {
  // Simple implementation to prevent TypeScript errors
  // Replace with your actual logic
  if (!detailedDate) {
    return { startDate: null, endDate: null };
  }

  try {
    // Placeholder implementation - replace with your actual parsing logic
    const now = new Date();
    const startDate = now;
    const endDate = new Date(now.getTime() + 86400000); // Add one day
    
    return {
      startDate: toFirebaseTimestamp(startDate),
      endDate: toFirebaseTimestamp(endDate),
    };
  } catch (error) {
    console.error("Error parsing date:", error);
    return { startDate: null, endDate: null };
  }
}

interface UpdateData {
  startDate?: admin.firestore.Timestamp | null;
  endDate?: admin.firestore.Timestamp | null;
  [key: string]: any;
}

// Using Firebase Functions v2 firestore API
export const processEventDates = onDocumentWritten('events/{eventId}', async (event) => {
  logger.info('Processing event dates', { eventId: event.params.eventId });
  
  // Make sure event.data exists
  if (!event.data) {
    logger.error('Event data is undefined');
    return;
  }
  
  // Skip if document deleted
  if (!event.data.after) {
    logger.info('Document was deleted, skipping');
    return;
  }

  const eventData = event.data.after.data() as Record<string, any> | undefined;
  
  // Only process if detailed_date exists and start/end dates don't
  if (!eventData?.detailed_date || (eventData.startDate && eventData.endDate)) {
    logger.info('No processing needed: detailed_date missing or dates already exist');
    return;
  }
  
  // Parse the dates
  const { startDate, endDate } = parseEventDate(eventData.detailed_date);
  
  // Update the document with parsed dates
  const updateData: UpdateData = {};
  if (startDate) updateData.startDate = startDate;
  if (endDate) updateData.endDate = endDate;
  
  try {
    await event.data.after.ref.update(updateData);
    logger.info('Updated event with parsed dates', updateData);
  } catch (error) {
    logger.error('Error updating event', error);
  }
});