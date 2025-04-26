import NodeGeocoder, { Options } from "node-geocoder";
import { DateTime } from "luxon";

// const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// export async function getLatLongFromCityState(
//   city: string,
//   state: string,
// ): Promise<{ lat: number; lng: number } | null> {
//   if (!apiKey) {
//     console.error("Google Maps API key not found");
//     return null;
//   }
//   const address = `${city}, ${state}`;
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status === "OK" && data.results.length > 0) {
//       const location = data.results[0].geometry.location;
//       return { lat: location.lat, lng: location.lng };
//     } else {
//       console.error(
//         "Error fetching coordinates:",
//         data.status,
//         data.error_message || "",
//       );
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//     return null;
//   }
// }

// // Helper function to get city and state from latitude and longitude
// export async function getCityState(
//   latitude: number,
//   longitude: number,
// ): Promise<{ city: string; state: string } | null> {
//   if (!apiKey) {
//     console.error("Google Maps API key not found");
//     return null;
//   }

//   // Fix for US coordinates: If latitude is in US range (24-50) and longitude is positive but in US range (65-125),
//   // convert it to negative as US is in western hemisphere
//   let lng = longitude;
//   if (latitude > 24 && latitude < 50 && longitude > 65 && longitude < 125) {
//     lng = -longitude;
//     console.log("Fixing US longitude from positive to negative:", {
//       original: longitude,
//       fixed: lng,
//     });
//   }

//   // Use the potentially corrected longitude for geocoding
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${lng}&key=${apiKey}`;
//   console.log("Geocoding URL (params only):", `latlng=${latitude},${lng}`);

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log("Geocoding response status:", data.status);

//     if (data.status === "OK" && data.results?.length > 0) {
//       // Process results
//       let city = "";
//       let state = "";

//       // Try extracting from address components first
//       const result = data.results[0];
//       if (result.address_components) {
//         for (const component of result.address_components) {
//           const types = component.types || [];

//           // Find city (try multiple component types)
//           if (types.includes("locality")) {
//             city = component.long_name;
//           } else if (!city && types.includes("sublocality_level_1")) {
//             city = component.long_name;
//           } else if (!city && types.includes("neighborhood")) {
//             city = component.long_name;
//           }

//           // Find state
//           if (types.includes("administrative_area_level_1")) {
//             state = component.short_name;
//           }
//         }
//       }

//       // Brooklyn special case (it's a borough, not always detected as a city)
//       const formattedAddress = result.formatted_address || "";
//       if (!city && formattedAddress.includes("Brooklyn")) {
//         city = "Brooklyn";
//       }

//       // If still no city, extract from formatted address
//       if (!city && formattedAddress) {
//         // Try to extract borough/neighborhood from formatted address
//         const parts = formattedAddress.split(",").map((p: string) => p.trim());
//         if (parts.length >= 1) {
//           city = parts[0];
//         }
//       }

//       // Default to "New York" if it's in NY but city is still empty
//       if (!city && state === "NY") {
//         city = "New York";
//       }

//       console.log("Final extracted location:", {
//         city,
//         state,
//         formattedAddress: result.formatted_address,
//       });
//       return { city, state };
//     }

//     console.error("Geocoding error or no results:", data);
//     return { city: "Unknown", state: "Unknown" };
//   } catch (error) {
//     console.error("Error in geocoding request:", error);
//     return { city: "Unknown", state: "Unknown" };
//   }
// }

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
