import { DateTime } from "luxon";

//Helper function to get start and end date as timestamps from event data date string.
export function parseEventDate(detailedDate: string): {
  startDate?: { seconds: number; nanoseconds: number };
  endDate?: { seconds: number; nanoseconds: number };
} {
  const currentYear = new Date().getFullYear();

  // Regular expressions to capture different formats
  const fullDateRegex =
    /([A-Za-z]+ \d{1,2}, \d{4}) \u00B7 (\d{1,2}:\d{2} [APap][Mm]) - ([A-Za-z]+ \d{1,2}, \d{4}) \u00B7 (\d{1,2}:\d{2} [APap][Mm])/;
  const singleDateRegex =
    /([A-Za-z]+, [A-Za-z]+ \d{1,2}) \u00B7 (\d{1,2}(?::\d{2})? ?[APap][Mm]) - (\d{1,2}(?::\d{2})? ?[APap][Mm]) (\w{3,4})/;

  let startDate: DateTime | null = null;
  let endDate: DateTime | null = null;

  if (fullDateRegex.test(detailedDate)) {
    const match = detailedDate.match(fullDateRegex);
    if (match) {
      startDate = DateTime.fromFormat(
        `${match[1]} ${match[2]}`,
        "MMMM d, yyyy h:mm a",
        { zone: "local" },
      );
      endDate = DateTime.fromFormat(
        `${match[3]} ${match[4]}`,
        "MMMM d, yyyy h:mm a",
        { zone: "local" },
      );
    }
  } else if (singleDateRegex.test(detailedDate)) {
    const match = detailedDate.match(singleDateRegex);
    if (match) {
      startDate = DateTime.fromFormat(
        `${match[1]} ${currentYear} ${match[2]}`,
        "EEEE, MMMM d yyyy h:mm a",
        { zone: match[4] },
      );
      endDate = DateTime.fromFormat(
        `${match[1]} ${currentYear} ${match[3]}`,
        "EEEE, MMMM d yyyy h:mm a",
        { zone: match[4] },
      );
    }
  }

  function toTimestamp(dateTime: DateTime | null) {
    return dateTime
      ? { seconds: Math.floor(dateTime.toSeconds()), nanoseconds: 0 }
      : undefined;
  }

  return {
    startDate: toTimestamp(startDate),
    endDate: toTimestamp(endDate),
  };
}
