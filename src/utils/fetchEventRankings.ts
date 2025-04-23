/**
 * Utility function to fetch event rankings from the API
 * @param vendorId The ID of the vendor to fetch rankings for
 */
export async function fetchEventRankings(vendorId: string) {
  try {
    const response = await fetch("/api/rankEvents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendorId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Failed to fetch event rankings",
        data: null,
      };
    }

    return {
      error: null,
      data,
    };
  } catch (err) {
    console.error("Error fetching event rankings:", err);
    return {
      error: "Failed to connect to ranking service",
      data: null,
    };
  }
}
