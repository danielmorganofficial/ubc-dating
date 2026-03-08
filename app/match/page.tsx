"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

export default function Match() {

  const [match, setMatch] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [matchDetails, setMatchDetails] = useState<any>(null)
  const [matchStatus, setMatchStatus] = useState<string | null>(null)
  const [dateIdeaDescription, setDateIdeaDescription] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function findMatch() {
      try {
        const currentUserId = localStorage.getItem("userId")
        
        if (!currentUserId) {
          setLoading(false)
          return
        }

        const userDocRef = doc(db, "users", currentUserId)
        const currentUserSnap = await getDoc(userDocRef)
        let currentUserData = null
        if (currentUserSnap.exists()) {
          currentUserData = currentUserSnap.data()
          setCurrentUser(currentUserData)
        }

        const res = await fetch("/api/pair")
        const data = await res.json()

        if (data.matches) {
          const myMatchData = data.matches.find(
            (m: any) => m.user1_id === currentUserId || m.user2_id === currentUserId || m.user_id === currentUserId
          )

          if (myMatchData) {
            if (myMatchData.match_status) {
              setMatchStatus(myMatchData.match_status)
            } else {
              const matchedId = myMatchData.user1_id === currentUserId ? myMatchData.user2_id : myMatchData.user1_id
              
              const docRef = doc(db, "users", matchedId)
              const docSnap = await getDoc(docRef)
              
              if (docSnap.exists()) {
                const matchData: any = { id: docSnap.id, ...docSnap.data() }
                setMatch(matchData)
                
                setMatchDetails({
                  compatibility: myMatchData.compatibility_percentage,
                  datePlan: myMatchData.date_plan,
                  reasoning: myMatchData.reasoning,
                  location: matchData.matchLocation || ""
                })

                // Generate concise date description via Gemini (also picks best location)
                try {
                  const ideaRes = await fetch("/api/generateDateIdea", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userAName: currentUserData?.profile?.username || currentUserData?.name || "User",
                      userAInterests: currentUserData?.profile?.interests || [],
                      userBName: matchData.profile?.username || matchData.name || "Match",
                      userBInterests: matchData.profile?.interests || []
                    })
                  })
                  if (ideaRes.ok) {
                    const ideaData = await ideaRes.json()
                    if (ideaData.dateIdea) setDateIdeaDescription(ideaData.dateIdea)
                    if (ideaData.location) setMatchDetails((prev: any) => ({ ...prev, location: ideaData.location }))
                  }
                } catch (e) {
                  console.error("Failed to fetch custom date idea", e)
                }

              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching match:", error)
      } finally {
        setLoading(false)
      }
    }

    findMatch()

  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">Consulting the AI Matchmaker...</p>
      </div>
    )
  }

  if (matchStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">No Match Found</h1>
        <p className="text-xl">{matchStatus}</p>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">No Match Found</h1>
        <p className="text-xl">You have no compatible partners right now.</p>
      </div>
    )
  }

  const locations = [
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
    "Point Grey Village"
  ]
  const suggestedLocation = locations[Math.floor(Math.random() * locations.length)]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 text-gray-900 pb-20 p-8 text-center pt-16">

      <h1 className="text-4xl font-bold text-pink-600">
        Your Weekly Match ❤️
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full mt-6 border border-gray-100">
        
        {match.profile?.profilePicture && (
          <img src={match.profile.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-pink-100 shadow-md" />
        )}

        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Meet {match.profile?.username || match.name || "someone special"}
        </h3>
        
        {matchDetails?.compatibility && (
          <div className="inline-block bg-pink-100 text-pink-800 px-4 py-1 rounded-full text-lg font-semibold my-2">
            {matchDetails.compatibility} Compatible
          </div>
        )}
        {match.profile?.description && (
          <p className="text-gray-700 italic my-3 text-lg">"{match.profile.description}"</p>
        )}

        <div className="text-gray-500 text-sm mb-6 space-y-1 mt-4">
          <p>📧 {match.profile?.email}</p>
          <p>📱 {match.profile?.phone}</p>
        </div>

        <p className="text-gray-600 mb-8 text-lg">
          They also like: <span className="font-medium text-pink-600">{match.profile?.interests?.[0] || match.hobby || "hanging out"}</span>
        </p>

        <div className="bg-pink-50 rounded-xl p-6 inline-block text-left border border-pink-100 max-w-md mx-auto w-full">
          <p className="font-bold text-pink-800 text-sm uppercase tracking-wider mb-2">Suggested Date</p>
          <p className="text-xl font-medium text-pink-900">
            📍 {matchDetails?.location || match.matchLocation || "UBC Campus"}
          </p>
          <p className="text-lg text-pink-800 mt-1 mb-3">
            🕒 Tuesday 6PM
          </p>
          
          {(dateIdeaDescription || matchDetails?.reasoning) && (
            <div className="pt-3 border-t border-pink-200 mt-2">
              {matchDetails?.reasoning && <p className="text-sm text-pink-800 leading-relaxed font-medium mb-3">🤝 {matchDetails.reasoning}</p>}
              {dateIdeaDescription && <p className="text-sm text-pink-800 leading-relaxed font-medium">✨ {dateIdeaDescription}</p>}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}