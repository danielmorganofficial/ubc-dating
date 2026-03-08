"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

export default function Match() {

  const [match, setMatch] = useState<any>(null)
  const [matchDetails, setMatchDetails] = useState<any>(null)
  const [matchStatus, setMatchStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function findMatch() {
      try {
        const currentUserId = localStorage.getItem("userId")
        
        if (!currentUserId) {
          setLoading(false)
          return
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
                setMatch({ id: docSnap.id, ...docSnap.data() })
                setMatchDetails({
                  compatibility: myMatchData.compatibility_percentage,
                  datePlan: myMatchData.date_plan,
                  reasoning: myMatchData.reasoning
                })
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">

      <h1 className="text-4xl font-bold text-pink-600">
        Your Weekly Match ❤️
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full mt-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {match.profile?.username || match.name || "someone special"}
        </h2>
        
        {matchDetails?.compatibility && (
          <div className="inline-block bg-pink-100 text-pink-800 px-4 py-1 rounded-full text-lg font-semibold my-2">
            {matchDetails.compatibility} Compatible
          </div>
        )}

        <div className="text-left mt-6 space-y-4 text-gray-700">
          <div>
            <span className="font-bold block text-gray-900">They also like:</span>
            {match.profile?.interests?.[0] || match.hobby || "hanging out"}
          </div>

          {matchDetails?.reasoning && (
            <div>
              <span className="font-bold block text-gray-900">Why you matched:</span>
              <p className="text-sm">{matchDetails.reasoning}</p>
            </div>
          )}

          {matchDetails?.datePlan && (
            <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 mt-6">
              <span className="font-bold flex items-center gap-2 text-pink-900 mb-1">
                 Suggested Date Plan
              </span>
              <p className="text-sm text-pink-800">
                {matchDetails.datePlan}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}