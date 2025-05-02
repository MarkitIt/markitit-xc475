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

    // Check if the response was successful BEFORE trying to parse JSON
    if (!response.ok) {
      let errorMessage = `Failed to fetch event rankings (Status: ${response.status})`;
      try {
        // Try to get more specific error details from the response body if possible
        const errorBody = await response.text(); 
        // Attempt to parse as JSON if it might contain structured error
        try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch (jsonError) {
            // If not JSON, use the raw text if it's not too long or an HTML page
            if (errorBody && !errorBody.trim().startsWith("<")) { 
                errorMessage = errorBody;
            }
        }
      } catch (textError) {
        // Ignore error trying to read body, use status code message
         errorMessage = `${errorMessage} ${response.statusText}`;
      }
      
      return {
        error: errorMessage,
        data: null,
      };
    }

    // If response is ok, THEN parse the JSON
    const data = await response.json();
    return {
      error: null,
      data,
    };

  } catch (err) {
    console.error("Error fetching event rankings:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown network error";
    return {
      error: `Failed to connect to ranking service: ${errorMessage}`,
      data: null,
    };
  }
}
