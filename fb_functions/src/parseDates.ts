/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Import v1 functions for Firestore triggers (v2 is imported separately)
import * as admin from "firebase-admin";
import { DateTime } from "luxon";

// Import v2 functions for HTTP triggers
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import v1 functions specifically
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";


const db = admin.firestore();

// The parseEventDate function (similar to the one in your utils)
function parseEventDate(date: string): {
  startDate: admin.firestore.Timestamp | null;
  endDate: admin.firestore.Timestamp | null;
} {
  if (!date) return { startDate: null, endDate: null };

  const currentYear = new Date().getFullYear();

  // Normalize the input string to remove any extra spaces and standardize separators
  const normalizedDate = date.trim().replace(/\s+/g, " ");
  logger.info(`Attempting to parse: "${normalizedDate}"`);

  let startDate: DateTime | null = null;
  let endDate: DateTime | null = null;

  try {
    // Map timezone abbreviations to IANA timezone names
    function mapTimezone(tzAbbr: string): string {
      const timezoneMap: Record<string, string> = {
        EDT: "America/New_York",
        EST: "America/New_York",
        CDT: "America/Chicago",
        CST: "America/Chicago",
        MDT: "America/Denver",
        MST: "America/Denver",
        PDT: "America/Los_Angeles",
        PST: "America/Los_Angeles",
      };
      return timezoneMap[tzAbbr] || "America/New_York"; // Default to Eastern
    }

    // Simple date format: "Feb 16, 12:00 pm - Feb 16, 6:00 pm"
    const simpleDateRegex =
      /([A-Za-z]+ \d{1,2}), (\d{1,2}:\d{2} [APap][Mm]) - ([A-Za-z]+ \d{1,2}), (\d{1,2}:\d{2} [APap][Mm])/;

    // Eventeny format with GMT timezone: "Sep 24, 2022 · 8:00 AM - Sep 24, 2022 · 2:30 PM(GMT-04:00) Eastern Time (US & Canada)"
    const eventenyRegex =
      /([A-Za-z]+ \d{1,2}, \d{4})(?:\s*·\s*|\s+)(\d{1,2}:\d{2} [APap][Mm]) - ([A-Za-z]+ \d{1,2}, \d{4})(?:\s*·\s*|\s+)(\d{1,2}:\d{2} [APap][Mm])(?:\((?:[Gg][Mm][Tt][+-]\d{2}:\d{2})?\)?(?:.*)?)?/;

    // EventBrite multiple days format: "May 31 · 10am - June 1 · 6pm EDT" or "June 21 · 4pm - June 22 · 1:30am EDT"
    const eventBriteMultiDayRegex =
      /([A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm]) - ([A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?/;

    // Weekday with time format: "Saturday, April 26 · 3 - 6pm EDT" or "Monday, April 28 · 7 - 10pm EDT"
    const weekdayTimeRangeRegex =
      /([A-Za-z]+, [A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})?)(?:\s+-\s+|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?/;

    // Weekday with time range (AM/PM on both): "Saturday, April 12 · 11:30am - 7:30pm EDT"
    const weekdayAmPmTimeRangeRegex =
      /([A-Za-z]+, [A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?:\s+-\s+|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?/;

    // Weekday with doors info: "Sunday, April 27 · 12 - 11:30pm EDT. Doors at 11:48am"
    const weekdayWithDoorsRegex =
      /([A-Za-z]+, [A-Za-z]+ \d{1,2})(?:\s*·\s*|\s+)(\d{1,2}(?::\d{2})?)(?:\s+-\s+|\s+)(\d{1,2}(?::\d{2})? ?[APap][Mm])(?: ([A-Za-z]{3,4}))?\.\s+Doors at.*/;

    // Zapplication format: "9/14/25 - 9/14/25" or "9/20/25 - 9/21/25"
    const zapplicationRegex =
      /(\d{1,2}\/\d{1,2}\/\d{2,4}) - (\d{1,2}\/\d{1,2}\/\d{2,4})/;

    // Check for simple date format first
    const simpleDateMatch = normalizedDate.match(simpleDateRegex);
    if (simpleDateMatch) {
      logger.info("Matched simpleDateRegex:", { match: simpleDateMatch });

      try {
        const timezone = "America/New_York"; // Default to Eastern Time

        // Parse dates with timezone
        startDate = DateTime.fromFormat(
          `${simpleDateMatch[1]} ${currentYear} ${simpleDateMatch[2]}`,
          "MMM d yyyy h:mm a",
          { zone: timezone },
        );
        endDate = DateTime.fromFormat(
          `${simpleDateMatch[3]} ${currentYear} ${simpleDateMatch[4]}`,
          "MMM d yyyy h:mm a",
          { zone: timezone },
        );

        if (!startDate.isValid || !endDate.isValid) {
          logger.error("Failed to parse simple date format");
          logger.error("Start date valid:", startDate.isValid);
          logger.error("End date valid:", endDate.isValid);
          if (!startDate.isValid) {
            logger.error(
              "Start date error:",
              startDate.invalidReason,
              startDate.invalidExplanation,
            );
          }
          if (!endDate.isValid) {
            logger.error(
              "End date error:",
              endDate.invalidReason,
              endDate.invalidExplanation,
            );
          }
        } else {
          logger.info("Successfully parsed dates:", {
            start: startDate.toISO(),
            end: endDate.toISO(),
          });
        }
      } catch (err) {
        const error = err as Error;
        logger.error(`Error parsing simple date format: ${error.message}`);
      }
    }
    // Check for Eventeny GMT format first (most specific and most common in the dataset)
    else {
      const eventenyMatch = normalizedDate.match(eventenyRegex);
      if (eventenyMatch) {
        logger.info("Matched eventenyRegex:", { match: eventenyMatch });

        try {
          // Extract timezone info
          let timezone = "America/New_York"; // Default to Eastern Time
          if (
            normalizedDate.includes("GMT-05:00") ||
            normalizedDate.includes("Central Time")
          ) {
            timezone = "America/Chicago"; // Central Time
          }

          // Parse dates with timezone
          startDate = DateTime.fromFormat(
            `${eventenyMatch[1]} ${eventenyMatch[2]}`,
            "MMMM d, yyyy h:mm a",
            { zone: timezone },
          );
          endDate = DateTime.fromFormat(
            `${eventenyMatch[3]} ${eventenyMatch[4]}`,
            "MMMM d, yyyy h:mm a",
            { zone: timezone },
          );

          // Try alternate format if first attempt fails
          if (!startDate.isValid) {
            startDate = DateTime.fromFormat(
              `${eventenyMatch[1]} ${eventenyMatch[2]}`,
              "MMM d, yyyy h:mm a",
              { zone: timezone },
            );
          }

          if (!endDate.isValid) {
            endDate = DateTime.fromFormat(
              `${eventenyMatch[3]} ${eventenyMatch[4]}`,
              "MMM d, yyyy h:mm a",
              { zone: timezone },
            );
          }
        } catch (err) {
          const error = err as Error;
          logger.error(`Error parsing Eventeny format: ${error.message}`);
        }
      }
      // EventBrite multi-day format
      else {
        const eventBriteMatch = normalizedDate.match(eventBriteMultiDayRegex);
        if (eventBriteMatch) {
          logger.info("Matched eventBriteMultiDayRegex:", {
            match: eventBriteMatch,
          });

          try {
            // Convert timezone abbreviation to IANA name
            const tzAbbr = eventBriteMatch[5] || "EDT";
            const timezone = mapTimezone(tzAbbr);

            // Add current year if not present
            const startMonth = eventBriteMatch[1];
            const startTime = eventBriteMatch[2];
            const endMonth = eventBriteMatch[3];
            const endTime = eventBriteMatch[4];

            startDate = DateTime.fromFormat(
              `${startMonth} ${currentYear} ${startTime}`,
              "MMMM d yyyy h:mma",
              { zone: timezone },
            );
            endDate = DateTime.fromFormat(
              `${endMonth} ${currentYear} ${endTime}`,
              "MMMM d yyyy h:mma",
              { zone: timezone },
            );
          } catch (err) {
            const error = err as Error;
            logger.error(
              `Error parsing EventBrite multi-day format: ${error.message}`,
            );
          }
        }
        // Weekday with AM/PM time range
        else {
          const weekdayAmPmMatch = normalizedDate.match(
            weekdayAmPmTimeRangeRegex,
          );
          if (weekdayAmPmMatch) {
            logger.info("Matched weekdayAmPmTimeRangeRegex:", {
              match: weekdayAmPmMatch,
            });

            try {
              // Convert timezone abbreviation to IANA name
              const tzAbbr = weekdayAmPmMatch[4] || "EDT";
              const timezone = mapTimezone(tzAbbr);

              // Parse the date parts
              const dayMonth = weekdayAmPmMatch[1]; // e.g., "Saturday, April 12"
              const startTime = weekdayAmPmMatch[2]; // e.g., "11:30am"
              const endTime = weekdayAmPmMatch[3]; // e.g., "7:30pm"

              startDate = DateTime.fromFormat(
                `${dayMonth} ${currentYear} ${startTime}`,
                "EEEE, MMMM d yyyy h:mma",
                { zone: timezone },
              );
              endDate = DateTime.fromFormat(
                `${dayMonth} ${currentYear} ${endTime}`,
                "EEEE, MMMM d yyyy h:mma",
                { zone: timezone },
              );
            } catch (err) {
              const error = err as Error;
              logger.error(
                `Error parsing weekday AM/PM format: ${error.message}`,
              );
            }
          }
          // Weekday with time (only end has AM/PM)
          else {
            const weekdayTimeMatch = normalizedDate.match(
              weekdayTimeRangeRegex,
            );
            if (weekdayTimeMatch) {
              logger.info("Matched weekdayTimeRangeRegex:", {
                match: weekdayTimeMatch,
              });

              try {
                // Convert timezone abbreviation to IANA name
                const tzAbbr = weekdayTimeMatch[4] || "EDT";
                const timezone = mapTimezone(tzAbbr);

                // Parse the date parts
                const dayMonth = weekdayTimeMatch[1]; // e.g., "Saturday, April 26"
                let startTime = weekdayTimeMatch[2]; // e.g., "3"
                const endTime = weekdayTimeMatch[3]; // e.g., "6pm"

                // Determine AM/PM for start time based on end time
                const isPM = endTime.toLowerCase().includes("pm");
                const isAM = endTime.toLowerCase().includes("am");

                // For start time with no AM/PM, derive it from end time
                // (Assume same AM/PM unless end time is earlier numericaly, or specifically says AM when 12 or higher)
                if (
                  !startTime.toLowerCase().includes("am") &&
                  !startTime.toLowerCase().includes("pm")
                ) {
                  const startHour = parseInt(startTime.split(":")[0]);
                  const endHour = parseInt(endTime.split(":")[0]);

                  // Logic for determining if start is AM or PM based on end time
                  if (isPM && (startHour <= endHour || endHour < 12)) {
                    startTime += "pm";
                  } else if (isAM) {
                    startTime += "am";
                  } else {
                    // Default to PM for events
                    startTime += "pm";
                  }
                }

                startDate = DateTime.fromFormat(
                  `${dayMonth} ${currentYear} ${startTime}`,
                  "EEEE, MMMM d yyyy h:mma",
                  { zone: timezone },
                );
                endDate = DateTime.fromFormat(
                  `${dayMonth} ${currentYear} ${endTime}`,
                  "EEEE, MMMM d yyyy h:mma",
                  { zone: timezone },
                );
              } catch (err) {
                const error = err as Error;
                logger.error(
                  `Error parsing weekday time range format: ${error.message}`,
                );
              }
            }
            // Weekday with doors info
            else {
              const weekdayDoorsMatch = normalizedDate.match(
                weekdayWithDoorsRegex,
              );
              if (weekdayDoorsMatch) {
                logger.info("Matched weekdayWithDoorsRegex:", {
                  match: weekdayDoorsMatch,
                });

                try {
                  // Convert timezone abbreviation to IANA name
                  const tzAbbr = weekdayDoorsMatch[4] || "EDT";
                  const timezone = mapTimezone(tzAbbr);

                  // Parse the date parts
                  const dayMonth = weekdayDoorsMatch[1]; // e.g., "Sunday, April 27"
                  let startTime = weekdayDoorsMatch[2]; // e.g., "12"
                  const endTime = weekdayDoorsMatch[3]; // e.g., "11:30pm"

                  // When no AM/PM on start, inherit from end time or default to PM
                  if (
                    !startTime.toLowerCase().includes("am") &&
                    !startTime.toLowerCase().includes("pm")
                  ) {
                    const isPM = endTime.toLowerCase().includes("pm");
                    if (isPM) {
                      startTime += "pm";
                    } else {
                      startTime += "am"; // Default to AM if end is AM
                    }
                  }

                  startDate = DateTime.fromFormat(
                    `${dayMonth} ${currentYear} ${startTime}`,
                    "EEEE, MMMM d yyyy h:mma",
                    { zone: timezone },
                  );
                  endDate = DateTime.fromFormat(
                    `${dayMonth} ${currentYear} ${endTime}`,
                    "EEEE, MMMM d yyyy h:mma",
                    { zone: timezone },
                  );
                } catch (err) {
                  const error = err as Error;
                  logger.error(
                    `Error parsing weekday with doors format: ${error.message}`,
                  );
                }
              }
              // Zapplication format
              else {
                const zapplicationMatch =
                  normalizedDate.match(zapplicationRegex);
                if (zapplicationMatch) {
                  logger.info("Matched zapplicationRegex:", {
                    match: zapplicationMatch,
                  });

                  try {
                    // Zapplication typically uses MM/DD/YY format
                    // For dates, we'll use noon (12:00 PM) as start and 11:59 PM as end time
                    startDate = DateTime.fromFormat(
                      zapplicationMatch[1],
                      "M/d/yy",
                      { zone: "local" },
                    ).set({ hour: 12 });

                    // For end date, use 11:59 PM of the end date
                    endDate = DateTime.fromFormat(
                      zapplicationMatch[2],
                      "M/d/yy",
                      { zone: "local" },
                    ).set({ hour: 23, minute: 59 });
                  } catch (err) {
                    const error = err as Error;
                    logger.error(
                      `Error parsing Zapplication format: ${error.message}`,
                    );
                  }
                } else {
                  logger.info(
                    `Could not match any regex pattern for: "${normalizedDate}"`,
                  );
                }
              }
            }
          }
        }
      }
    }

    // Validate the parsed dates
    if (startDate && !startDate.isValid) {
      logger.info(
        `Invalid start date parsed: ${startDate.invalidReason} - ${startDate.invalidExplanation}`,
      );
      startDate = null;
    }

    if (endDate && !endDate.isValid) {
      logger.info(
        `Invalid end date parsed: ${endDate.invalidReason} - ${endDate.invalidExplanation}`,
      );
      endDate = null;
    }
  } catch (error) {
    const err = error as Error;
    logger.error(`Error parsing date "${normalizedDate}":`, err);
    return { startDate: null, endDate: null };
  }

  // Debug output
  if (startDate && endDate) {
    logger.info(`Successfully parsed dates:
      Start: ${startDate.toISO()} (${startDate.toLocaleString(DateTime.DATETIME_FULL)})
      End: ${endDate.toISO()} (${endDate.toLocaleString(DateTime.DATETIME_FULL)})
    `);
  } else {
    logger.info(`Failed to parse complete date range for "${normalizedDate}"`);
  }

  return {
    startDate: startDate
      ? admin.firestore.Timestamp.fromDate(startDate.toJSDate())
      : null,
    endDate: endDate
      ? admin.firestore.Timestamp.fromDate(endDate.toJSDate())
      : null,
  };
}

interface UpdateData {
  startDate?: admin.firestore.Timestamp | null;
  endDate?: admin.firestore.Timestamp | null;
  [key: string]: any;
}

// Using Firebase Functions v2 firestore API
export const processEventDates = onDocumentWritten(
  {
    document: "events/{eventId}",
    region: "us-central1",
  },
  async (event) => {
    logger.info("Processing event dates", { eventId: event.params.eventId });

    // Make sure event.data exists
    if (!event.data) {
      logger.error("Event data is undefined");
      return;
    }

    // Skip if document deleted
    if (!event.data.after) {
      logger.info("Document was deleted, skipping");
      return;
    }

    const eventData = event.data.after.data() as
      | Record<string, any>
      | undefined;

    // Only process if detailed_date exists and start/end dates don't
    if (
      !eventData?.detailed_date ||
      (eventData.startDate && eventData.endDate)
    ) {
      logger.info(
        "No processing needed: detailed_date missing or dates already exist",
      );
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
      logger.info("Updated event with parsed dates", updateData);
    } catch (error) {
      logger.error("Error updating event", error);
    }
  },
);

// Function to process all existing events
export const updateAllEventDates = onSchedule(
  {
    schedule: "0 0 * * *", // Runs at midnight every day
    timeZone: "America/New_York", // Adjust timezone as needed
    region: "us-central1",
  },
  async (event) => {
    try {
      logger.info("Starting to process all events");

      // Get all events
      const eventsSnapshot = await db.collection("events").get();
      const totalEvents = eventsSnapshot.size;
      let processedCount = 0;
      let updatedCount = 0;

      logger.info(`Found ${totalEvents} events to process`);

      // Process each event
      for (const doc of eventsSnapshot.docs) {
        const eventData = doc.data();

        // Only process if detailed_date exists and start/end dates don't
        if (
          eventData.detailed_date &&
          (!eventData.startDate || !eventData.endDate)
        ) {
          const { startDate, endDate } = parseEventDate(
            eventData.detailed_date,
          );

          const updateData: UpdateData = {};
          if (startDate) updateData.startDate = startDate;
          if (endDate) updateData.endDate = endDate;

          if (Object.keys(updateData).length > 0) {
            await doc.ref.update(updateData);
            updatedCount++;
          }
        }

        processedCount++;
        if (processedCount % 100 === 0) {
          logger.info(`Processed ${processedCount}/${totalEvents} events`);
        }
      }

      logger.info(
        `Completed processing all events. Updated ${updatedCount} events`,
      );
    } catch (error) {
      logger.error("Error processing events:", error);
      throw error;
    }
  },
);

// Function to process all existing events
export const processAllEvents = onRequest(
  {
    region: "us-central1",
  },
  async (req, res) => {
    try {
      logger.info("Starting to process all events");

      // Get all events
      const eventsSnapshot = await db.collection("events").get();
      const totalEvents = eventsSnapshot.size;
      let processedCount = 0;
      let updatedCount = 0;
      let sampleEvents = [];

      logger.info(`Found ${totalEvents} events to process`);

      // Process each event
      for (const doc of eventsSnapshot.docs) {
        const eventData = doc.data();

        // Log first 5 events for debugging
        if (sampleEvents.length < 5) {
          sampleEvents.push({
            id: doc.id,
            date: eventData.date,
            detailed_date: eventData.detailed_date,
            startDate: eventData.startDate,
            endDate: eventData.endDate,
          });
        }

        // Check both date and detailed_date fields
        const dateToProcess = eventData.date || eventData.detailed_date;

        // Check if timestamps are missing or zero
        const hasValidStartDate =
          eventData.startDate && eventData.startDate.seconds !== 0;
        const hasValidEndDate =
          eventData.endDate && eventData.endDate.seconds !== 0;

        // Process if we have a date and either timestamp is missing or zero
        if (dateToProcess && (!hasValidStartDate || !hasValidEndDate)) {
          logger.info(
            `Processing event ${doc.id} with date: "${dateToProcess}"`,
          );

          const { startDate, endDate } = parseEventDate(dateToProcess);

          const updateData: UpdateData = {};
          if (startDate) updateData.startDate = startDate;
          if (endDate) updateData.endDate = endDate;

          if (Object.keys(updateData).length > 0) {
            logger.info(`Updating event ${doc.id} with:`, updateData);
            await doc.ref.update(updateData);
            updatedCount++;
          } else {
            logger.warn(
              `Could not parse date for event ${doc.id}: "${dateToProcess}"`,
            );
          }
        } else {
          if (!dateToProcess) {
            logger.info(
              `Skipping event ${doc.id}: no date or detailed_date field`,
            );
          } else {
            logger.info(
              `Skipping event ${doc.id}: already has valid start/end dates`,
            );
          }
        }

        processedCount++;
        if (processedCount % 100 === 0) {
          logger.info(`Processed ${processedCount}/${totalEvents} events`);
        }
      }

      logger.info("Sample Events:", JSON.stringify(sampleEvents, null, 2));
      logger.info(
        `Completed processing all events. Updated ${updatedCount} events`,
      );

      res.status(200).send({
        message: "Successfully processed all events",
        totalEvents,
        updatedEvents: updatedCount,
        details: "Check function logs for more information",
        sampleEvents,
      });
    } catch (error) {
      const err = error as Error;
      logger.error("Error processing events:", err);
      res.status(500).send({
        error: "Failed to process events",
        details: err.message,
      });
    }
  },
);
