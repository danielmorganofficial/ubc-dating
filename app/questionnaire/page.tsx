"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function Questionnaire() {

  const router = useRouter()

  const [hobby, setHobby] = useState("")
  const [personality, setPersonality] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {

      // get user id saved during signup
      const userId = localStorage.getItem("userId")

      if (userId) {

        // reference the correct user document
        const userRef = doc(db, "users", userId)

        // update that user with preferences
        await updateDoc(userRef, {
          hobby,
          personality
        })

        console.log("Preferences saved")

      }

    } catch (error) {

      console.error("Error saving preferences:", error)

    }

    // move to match page
    router.push("/match")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">

      <h1 className="text-3xl font-bold">
        Quick Questions
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-64"
      >

        <select
          required
          className="border p-2 rounded"
          onChange={(e) => setHobby(e.target.value)}
        >
          <option value="">Favorite Hobby</option>
          <option>Gym</option>
          <option>Gaming</option>
          <option>Cooking</option>
          <option>Hiking</option>
        </select>

        <select
          required
          className="border p-2 rounded"
          onChange={(e) => setPersonality(e.target.value)}
        >
          <option value="">Personality</option>
          <option>Introvert</option>
          <option>Extrovert</option>
          <option>Ambivert</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Find My Date
        </button>

      </form>

    </div>
  )
}