import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro"; // You can also try "gemini-pro"
const API_KEY = process.env.GEMINI_API_KEY || ""; // Add this to your .env.local

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface EventInput {
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
  };
  date?: string;
}

interface FormattedEvent {
  description: string;
  booth_fees: string;
  category_tags: string[];
  type: "Food" | "Market";
  demographic_guess: string[];
  vendor_categories: string[];
  estimated_headcount: string; // String to allow things like "Approx. 22,000"
}

function buildPrompt(event: EventInput): string {
  return `
You are helping format web-scraped event data into a clean database.

Based ONLY on the input, output the following fields STRICTLY in JSON format:
---
- description: (2-3 sentences capturing the main event highlights)
- booth_fees: (mention vendor/booth fees; "N/A" if not known)
- category_tags: (Pick ONLY from: ["College pop-ups", "Indoor markets", "Outdoor festivals", "Holiday fairs", "Private corporate events", "Farmers markets", "Art fairs", "Seasonal markets", "Festival", "Other"]. Multiple allowed.)
- type: ("Food" or "Market")
- demographic_guess: (Select 3-5 likely audiences based on description from: ["Students / College Crowd", "Families", "Young Professionals", "Tourists", "Local Regulars", "High-Income Shoppers", "Budget-Conscious Shoppers", "Trendsetters / Influencers", "Art Collectors / Design Enthusiasts", "Foodies / Culinary Explorers", "Health & Wellness Enthusiasts", "Eco-Conscious / Sustainable Shoppers", "Spiritual / Holistic Audiences", "Fashion-Focused Customers", "Parents & Kids", "Pet Owners", "BIPOC Communities", "LGBTQ+ Community", "Elderly / Retired Shoppers", "Remote Workers / Digital Nomads", "Festival-Goers / Music Lovers", "Travelers & Expats", "Gift Shoppers / Holiday Buyers"])
- vendor_categories: (Pick 3-5 vendor types from: ["Accessories", "Art", "Fashion", "Kids", "Home Decor", "Beauty & Skincare", "Jewelry", "Food & Beverage", "Candles", "Books & Stationery", "Tech & Gadgets", "Vintage & Thrift", "Handmade Goods", "Pet Products", "Wellness & Health", "Plants & Gardening", "Toys & Games", "Bags & Wallets", "Spiritual & Metaphysical", "Sports & Fitness", "Bath & Body", "Music & Instruments", "Automotive", "Photography", "Sustainable & Eco-Friendly", "Gifts & Seasonal", "DIY & Craft Supplies", "Furniture", "Men's Fashion", "Women's Fashion", "Children's Fashion", "Digital Art & NFTs", "Custom Apparel", "Luxury Goods", "Event Planning & Party Supplies", "Hobby & Collectibles", "Baking & Desserts"])
- estimated_headcount: (Give best guess based on input description; if no number given, infer based on event size words like "large", "small", etc.)

Respond ONLY with clean, parsable JSON. No other text.

---
Event Info:
Name: ${event.name}
Location: ${event.location.city}, ${event.location.state}
Description: ${event.description}
Date(s): ${event.date || "N/A"}
---
`;
}

export async function formatEvents(event: EventInput): Promise<FormattedEvent> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(event);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });

  const response = await result.response.text();

  try {
    const parsed = JSON.parse(response);
    return parsed as FormattedEvent;
  } catch (error) {
    console.error("Error parsing Gemini response:", response);
    throw new Error("Failed to parse Gemini response as JSON");
  }
}
