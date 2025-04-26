import * as admin from "firebase-admin";
admin.initializeApp();

export { onNewEventCreated } from "./formatEvents";
export { processEventDates, updateAllEventDates, processAllEvents } from "./parseDates";
export { batchFormatEvents } from "./batchFormatEvents";