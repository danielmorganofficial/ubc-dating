"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export default function Match() {

  const [match, setMatch] = useState<any>(null)

  useEffect(() => {

    async function findMatch() {

      const querySnapshot = await getDocs(collection(db, "users"))

      const users: any[] = []

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() })
      })

      if (users.length > 1) {

        // simple random match
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
        Meet {match.name}
      </p>

      <p>
        They also like: {match.hobby}
      </p>

      <p className="font-bold mt-4">
        Suggested Date
      </p>

      <p>
        {location} — Tuesday 6PM
      </p>

    </div>
  )
}