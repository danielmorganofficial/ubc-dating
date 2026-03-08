import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }

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
      Below is a list of users with their IDs, profiles, and questionnaire answers.
      Please pair them up based on compatibility (gender preferences, lifestyle, hobbies, MBTI).
      Ensure every user is either paired or left out.
      If a user is left out (e.g. odd number of users or no compatible match), their status should be the exact phrase: "this week, there are no compatible partners".

      Users data:
      ${JSON.stringify(users, null, 2)}

      IMPORTANT: Suggest a unique and fun Date Plan specific to the matched users' shared interests. Give a Compatibility Percentage.

      Please return a JSON response strictly in this array format:
      [
        {
          "user1_id": "id1",
          "user2_id": "id2",
          "reasoning": "Why they match...",
          "compatibility_percentage": "85%",
          "date_plan": "Specific date suggestion based on their interests..."
        },
        ...
        {
          "user_id": "id_unmatched",
          "match_status": "this week, there are no compatible partners"
        }
      ]

      Only output the JSON array without markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();

    const matchData = JSON.parse(text);

    return NextResponse.json({ matches: matchData });
  } catch (error) {
    console.error("Error generating matches:", error);
    return NextResponse.json(
      { error: "Failed to generate matches" },
      { status: 500 }
    );
  }
}
