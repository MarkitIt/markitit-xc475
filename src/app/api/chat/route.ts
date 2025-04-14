import { NextResponse } from "next/server";
import { getGeminiResponse } from "@/utils/gemini";

export async function POST(request: Request) {
  const { query } = await request.json();

  try {
    const answer = await getGeminiResponse(query);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ answer: "An error occurred. Please try again." });
  }
}
