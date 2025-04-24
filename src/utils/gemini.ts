import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function getGeminiResponse(query: string, vendorData: Record<string, any>) {
  if (!query || !vendorData) {
    throw new Error("Missing query or vendor data.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const contextPrompt = `
You are a financial assistant for vendor events. Your job is to help vendors decide whether events are worth attending.

Here is some information about the vendor:
- Business Name: ${vendorData.businessName || "N/A"}
- City: ${vendorData.city || "N/A"}
- Travel Preference: ${vendorData.travelPreference || "N/A"}
- Travel Radius: ${vendorData.travelRadius || 0} miles
- Max Application Fee: $${vendorData.budget?.maxApplicationFee || 0}
- Max Vendor Fee: $${vendorData.budget?.maxVendorFee || 0}
- Description: ${vendorData.description || "No description provided."}

Keep responses short, helpful, and vendor-friendly. If the user asks about cost, answer relative to their limits.
`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${contextPrompt}\n\nUser: ${query}` }],
      },
    ],
  });

  const response = await result.response;
  return response.text();
}
