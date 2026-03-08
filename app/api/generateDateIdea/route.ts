import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userAName, userAInterests, userBName, userBInterests, suggestedLocation } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not defined" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a fun AI matchmaker writing a personalized date suggestion.
      
      The two users have been matched and their date venue has ALREADY been decided: "${suggestedLocation}".
      You MUST write a 1-2 sentence date idea that takes place AT "${suggestedLocation}" — do NOT suggest any other location.
      Use their actual first names (${userAName} and ${userBName}) naturally in the sentence.
      Connect their shared interests to something they could specifically enjoy at ${suggestedLocation}.
      
      ${userAName}'s Interests: ${userAInterests.join(", ") || "general activities"}
      ${userBName}'s Interests: ${userBInterests.join(", ") || "general activities"}
      
      RULES:
      - MUST mention "${suggestedLocation}" by name
      - MUST use "${userAName}" and "${userBName}" by name  
      - Output ONLY the sentence, no extra commentary
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Post-processing to ensure the suggestedLocation is always present
    if (!text.includes(suggestedLocation)) {
      // Attempt to find any location-like phrase and replace it, or just append if none found
      const locationRegex = /(at|in|on)\s+([A-Z][a-zA-Z0-9\s'-]+(?:[,\s]+[A-Z][a-zA-Z0-9\s'-]+)*)/g;
      if (locationRegex.test(text)) {
        text = text.replace(locationRegex, `$1 ${suggestedLocation}`);
      } else {
        // If no location phrase was found, try to insert it naturally
        // This is a simple heuristic; more complex NLP might be needed for perfect placement
        const lastPeriodIndex = text.lastIndexOf('.');
        if (lastPeriodIndex !== -1) {
          text = text.substring(0, lastPeriodIndex) + ` at ${suggestedLocation}.`;
        } else {
          text += ` at ${suggestedLocation}.`;
        }
      }
    }

    return NextResponse.json({ dateIdea: text });
  } catch (error) {
    console.error("Error generating date idea:", error);
    return NextResponse.json(
      { error: "Failed to generate date idea" },
      { status: 500 }
    );
  }
}
