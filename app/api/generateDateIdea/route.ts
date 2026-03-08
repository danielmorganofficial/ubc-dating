import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ALL_LOCATIONS = [
  // UBC
  "Blue Chip Café",
  "Nitobe Memorial Garden",
  "Wreck Beach",
  "Great Dane Coffee",
  "UBC Rose Garden",
  "Pacific Spirit Regional Park",
  "UBC Botanical Garden",
  "Spanish Banks Beach",
  "AMS Student Nest",
  "Koerner's Pub",
  "Main Mall",
  "Museum of Anthropology (MOA)",
  "Beaty Biodiversity Museum",
  "UBC Aquatic Centre",
  "UBC Student Recreation Centre",
  "The Aviary (Climbing Wall)",
  "Wesbrook Village",
  "Rain or Shine Ice Cream",
  "Jericho Beach",
  "Point Grey Village",
  // Vancouver
  "Stanley Park",
  "English Bay Beach",
  "Sunset Beach",
  "Kitsilano Beach",
  "Spanish Banks",
  "Granville Island",
  "Canada Place",
  "Coal Harbour Seawall",
  "Vancouver Seawall",
  "VanDusen Botanical Garden",
  "Queen Elizabeth Park",
  "Dr. Sun Yat-Sen Classical Chinese Garden",
  "Bloedel Conservatory",
  "Lighthouse Park",
  "Deep Cove",
  "Capilano Suspension Bridge Park",
  "Lynn Canyon Park",
  "Lynn Canyon Suspension Bridge",
  "Grouse Mountain",
  "Cypress Mountain",
  "Mount Seymour",
  "Commercial Drive",
  "Gastown",
  "Yaletown",
  "Robson Street",
  "Main Street (Mount Pleasant)",
  "Olympic Village",
  "Science World",
  "David Lam Park",
  "George Wainborn Park",
  "Trout Lake Park",
  "Central Park (Burnaby)",
  "Jericho Pier",
  "Steveston Village",
];

export async function POST(req: Request) {
  try {
    const { userAName, userAInterests, userBName, userBInterests } = await req.json();

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
      You are a fun AI matchmaker planning a date for two matched users.
      
      Their names and interests:
      - ${userAName}'s Interests: ${userAInterests.join(", ") || "general activities"}
      - ${userBName}'s Interests: ${userBInterests.join(", ") || "general activities"}
      
      From the list below, choose the SINGLE BEST location for their date based on their shared or complementary interests:
      ${ALL_LOCATIONS.map((l, i) => `${i + 1}. ${l}`).join("\n")}
      
      Then write a 1-2 sentence date description that:
      - Uses ${userAName} and ${userBName} by name
      - Names the chosen location explicitly
      - Connects their interests to something they can enjoy AT that location
      
      Respond ONLY in this exact JSON format (no markdown, no extra text):
      {
        "location": "The chosen location name exactly as listed above",
        "dateIdea": "The 1-2 sentence date description."
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let location = "";
    let dateIdea = "";

    try {
      const parsed = JSON.parse(text);
      location = parsed.location || "";
      dateIdea = parsed.dateIdea || "";
    } catch {
      // If JSON parse fails, return the raw text as the date idea with a fallback location
      dateIdea = text;
      location = ALL_LOCATIONS[Math.floor(Math.random() * ALL_LOCATIONS.length)];
    }

    // Safety: ensure location is one we recognize
    if (!ALL_LOCATIONS.includes(location)) {
      location = ALL_LOCATIONS[Math.floor(Math.random() * ALL_LOCATIONS.length)];
    }

    // Safety: ensure the location name appears in the dateIdea text
    if (dateIdea && !dateIdea.includes(location)) {
      const lastPeriod = dateIdea.lastIndexOf(".");
      dateIdea = lastPeriod !== -1
        ? dateIdea.substring(0, lastPeriod) + ` at ${location}.`
        : dateIdea + ` at ${location}.`;
    }

    return NextResponse.json({ dateIdea, location });
  } catch (error) {
    console.error("Error generating date idea:", error);
    return NextResponse.json(
      { error: "Failed to generate date idea" },
      { status: 500 }
    );
  }
}
