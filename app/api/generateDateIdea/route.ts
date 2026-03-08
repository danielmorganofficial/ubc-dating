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
      You are an expert AI matchmaker. 
      Given the following interests of two matched users, suggest a very concise, 1-2 sentence fun date idea that they could do together exactly at the specified location: "${suggestedLocation}".
      It should read naturally using their actual names. For example, "Since ${userAName} and ${userBName} both like hiking, you could go hiking at ${suggestedLocation}!".
      
      ${userAName}'s Interests: ${userAInterests.join(", ")}
      ${userBName}'s Interests: ${userBInterests.join(", ")}
      
      Output ONLY the sentence.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    return NextResponse.json({ dateIdea: text });
  } catch (error) {
    console.error("Error generating date idea:", error);
    return NextResponse.json(
      { error: "Failed to generate date idea" },
      { status: 500 }
    );
  }
}
