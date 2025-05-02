import { GoogleGenerativeAI } from "@google/generative-ai";
// Only load dotenv in local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const MODEL_NAME = "gemini-1.5-pro"; // You can also try "gemini-pro"

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }
  return new GoogleGenerativeAI(apiKey);
}

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

export function buildPrompt(event: EventInput): string {
  return `
You are helping format web-scraped event data into a clean database.

Based ONLY on the input, output the following fields STRICTLY in JSON format:
---
- description: (4-7 sentences capturing the main event highlights)
- booth_fees: (Return as an OBJECT/map. Keys should be the booth type/label (e.g., "Standard 10x10 Artisan Booth") and values should be the price as a number (e.g., 275). If no booth fees are mentioned, return an empty object: {}.)
- application_fee: (Look for phrases like 'application fee', 'apply fee', 'jury fee', 'processing fee'. Extract the associated dollar amount. Return ONLY the number, e.g., 25. Return null if no fee is mentioned.)
- category_tags: (Pick ONLY from: ["College pop-ups", "Indoor markets", "Outdoor festivals", "Holiday fairs", "Private corporate events", "Farmers markets", "Art fairs", "Seasonal markets", "Festival", "Other"])
- type: ("Food" or "Market")
- demographic_guess: (Select 3-5 likely audiences based on description and name of the event from the following list: ["Students / College Crowd", "Families", "Young Professionals", "Tourists", "Local Regulars", "High-Income Shoppers", "Budget-Conscious Shoppers", "Trendsetters / Influencers", "Art Collectors / Design Enthusiasts", "Foodies / Culinary Explorers", "Health & Wellness Enthusiasts", "Eco-Conscious / Sustainable Shoppers", "Spiritual / Holistic Audiences", "Fashion-Focused Customers", "Parents & Kids", "Pet Owners", "BIPOC Communities", "Black / African American Communities", "Latinx / Hispanic Communities", "Asian American & Pacific Islander (AAPI) Communities", "Native American / Indigenous Communities", "Middle Eastern & North African (MENA) Communities", "LGBTQ+ Community", "Women-Centered Audiences", "Men-Centered Audiences", "Nonbinary / Gender Diverse Audiences", "Mothers", "Fathers", "Single Parents", "Elderly / Retired Shoppers", "Remote Workers / Digital Nomads", "Festival-Goers / Music Lovers", "Travelers & Expats", "Gift Shoppers / Holiday Buyers", "Craft / DIY Enthusiasts", "Outdoor Adventurers", "Home & Garden Enthusiasts", "Tech Enthusiasts & Early Adopters", "Parents-to-Be / New Parents", "Cultural Enthusiasts", "Sports Fans", "Collectors (Vintage, Comics, Antiques)", "Social Justice Advocates", "Faith-Based Audiences (e.g., Christian, Muslim, Jewish Events)", "Immigrant Communities", "Veterans / Military Families", "Disability Community"])
- vendor_categories: (Pick 3-5 vendor types from: ["Accessories", "Art", "Fashion", "Kids", "Home Decor", "Beauty & Skincare", "Jewelry", "Food & Beverage", "Candles", "Books & Stationery", "Tech & Gadgets", "Vintage & Thrift", "Handmade Goods", "Pet Products", "Wellness & Health", "Plants & Gardening", "Toys & Games", "Bags & Wallets", "Spiritual & Metaphysical", "Sports & Fitness", "Bath & Body", "Music & Instruments", "Automotive", "Photography", "Sustainable & Eco-Friendly", "Gifts & Seasonal", "DIY & Craft Supplies", "Furniture", "Men's Fashion", "Women's Fashion", "Children's Fashion", "Digital Art & NFTs", "Custom Apparel", "Luxury Goods", "Event Planning & Party Supplies", "Hobby & Collectibles", "Baking & Desserts", "Mexican", "Asian", "Italian", "Middle Eastern", "African", "Caribbean", "Latin American", "Indian", "Japanese", "Korean", "Vietnamese", "Thai"])
- num_vendors: (Guess based on event description. Output ONLY a number. If description says "small", "few", etc., guess between 5 and 50. If "large", "many", "festival", guess between 100 and 500. Default to 0 if unknown.)
- headcount_min and headcount_max: (Estimate attendance. If a single number is described, set it as headcount_min and leave headcount_max null. If a range is described, set both. For phrases like "several thousand", use 1000 to 10000. For "tens of thousands", use 10000 to 100000. For "hundreds of thousands", use 100000 to 500000. Default both to 0 if unknown.)

Make sure to return a valid JSON object that can be parsed with JSON.parse().
DO NOT wrap your output in markdown formatting (no triple backticks).
Only return a pure JSON object — no extra text or explanations.

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
  const model = getGeminiClient().getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(event);

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
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

export function cleanEventName(name: string): string {
  if (!name) return "";

  return name
    .replace(
      /\b(call\s*for\s*vendors|application\s*open|apply\s*now|vendor\s*sign[-\s]*up)\b/gi,
      ""
    ) // remove phrases like "call for vendors", "application open", etc.
    .replace(/[-–—]+/g, " ") // replace hyphens, en dashes, em dashes with spaces
    .replace(/\s{2,}/g, " ") // collapse multiple spaces into one
    .replace(/\s+$/, "") // remove any trailing whitespace
    .replace(/^\s+/, "") // remove any leading whitespace
    .trim(); // final clean
}
