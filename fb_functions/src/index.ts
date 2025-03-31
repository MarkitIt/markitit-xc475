/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { DateTime } = require('luxon');

admin.initializeApp();
const db = admin.firestore();

// The parseEventDate function (similar to the one in your utils)
function parseEventDate(detailedDate) {
  // Your existing date parsing logic
  // ...
  
  return {
    startDate: toFirebaseTimestamp(startDate),
    endDate: toFirebaseTimestamp(endDate),
  };
}

exports.processEventDates = functions.firestore
  .document('events/{eventId}')
  .onWrite((change, context) => {
    // Skip if document deleted
    if (!change.after.exists) return null;

    const eventData = change.after.data();
    
    // Only process if detailed_date exists and start/end dates don't
    if (!eventData.detailed_date || (eventData.startDate && eventData.endDate)) {
      return null;
    }
    
    // Parse the dates
    const { startDate, endDate } = parseEventDate(eventData.detailed_date);
    
    // Update the document with parsed dates
    const updateData = {};
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    
    return change.after.ref.update(updateData);
  });