import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, updateDoc, doc, deleteField } from "firebase/firestore"

// One-time admin route to clear stale match data from all users
// Visit: GET /api/resetMatches
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "users"))

    const updates: Promise<void>[] = []

    snapshot.forEach((d) => {
      updates.push(
        updateDoc(doc(db, "users", d.id), {
          matchId: deleteField(),
          matchSuggestion: deleteField(),
          matchCompatibility: deleteField(),
          matchIdeaDescription: deleteField(),
          matchLocation: deleteField(),
        })
      )
    })

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: `Cleared match data for ${updates.length} user(s). They will be re-matched on next dashboard visit.`,
    })
  } catch (err) {
    console.error("Reset error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
