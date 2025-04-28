import * as admin from "firebase-admin";

admin.initializeApp();

// These import paths need to match the versions used in each function file
import { batchFormatEvents } from "./batchFormatEvents"; // Using v1
import { onNewEventCreated } from "./formatEvents"; // Using v2

export { batchFormatEvents, onNewEventCreated };
