"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { suggestMatchDate, Availability } from "scheduler"

export default function Match() {

  const [match, setMatch] = useState<any>(null)
  const [dateSuggestion, setDateSuggestion] = useState<Availability | null>(null)

  useEffect(() => {

    async function findMatch() {

      const querySnapshot = await getDocs(collection(db, "users"))

      const currentUserId = localStorage.getItem("userId")
      let currentUser: any = null
      const users: any[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (doc.id === currentUserId) {
          currentUser = { id: doc.id, ...data }
        } else {
          users.push({ id: doc.id, ...data })
        }
      })

      if (currentUser && users.length > 0) {
        
        // Find users with overlapping availability
        const currentUserAvailability = currentUser.profile?.availability || []
        
        const validMatches = users.map((u: any) => ({
          user: u,
          suggestion: suggestMatchDate(currentUserAvailability, u.profile?.availability || [])
        })).filter((m: any) => m.suggestion !== null)

        if (validMatches.length > 0) {
          const randomMatch = validMatches[Math.floor(Math.random() * validMatches.length)]
          setMatch(randomMatch.user)
          setDateSuggestion(randomMatch.suggestion)
        } else {
          // Fallback if no valid matches
          const randomUser = users[Math.floor(Math.random() * users.length)]
          setMatch(randomUser)
          setDateSuggestion(suggestMatchDate(currentUserAvailability, randomUser.profile?.availability || []) || { day: "Tuesday", time: "Evening" })
        }
      } else if (users.length > 0) {
        // Fallback if current user not found
        const randomUser = users[Math.floor(Math.random() * users.length)]
        setMatch(randomUser)
      }

    }

    findMatch()

  }, [])

  const locations = [
    "Blue Chip Cafe",
    "Nitobe Garden",
    "Wreck Beach",
    "Great Dane Coffee",
    "UBC Rose Garden"
  ]

  const location = locations[Math.floor(Math.random() * locations.length)]

  if (!match) {
    return <div className="p-10">Finding your match...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">

      <h1 className="text-3xl font-bold">
        Your Weekly Match ❤️
      </h1>

      <p className="text-xl">
        Meet {match.profile?.username || match.name || "someone special"}
      </p>

      <p>
        They also like: {match.profile?.interests?.[0] || match.hobby || "hanging out"}
      </p>

      <p className="font-bold mt-4">
        Suggested Date
      </p>

      <p>
        {location} — {dateSuggestion ? `${dateSuggestion.day} ${dateSuggestion.time}` : "Tuesday 6PM"}
      </p>

    </div>
  )
}