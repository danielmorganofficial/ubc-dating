"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function Questionnaire() {

  const router = useRouter()

  const [hobby, setHobby] = useState("")
  const [personality, setPersonality] = useState("")

  const [prefGender, setPrefGender] = useState("")
  const [prefEthnicity, setPrefEthnicity] = useState("")
  const [prefReligion, setPrefReligion] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {

      const userId = localStorage.getItem("userId")

      if (userId) {

        const userRef = doc(db, "users", userId)

        await updateDoc(userRef, {
          hobby,
          personality,
          prefGender,
          prefEthnicity,
          prefReligion
        })

      }

    } catch (error) {

      console.error("Error saving preferences:", error)

    }

    router.push("/match")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">

      <h1 className="text-3xl font-bold">
        Match Preferences
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-72"
      >

        <select
          required
          className="border p-2 rounded"
          onChange={(e)=>setHobby(e.target.value)}
        >
          <option value="">Favorite Hobby</option>
          <option>Gym</option>
          <option>Gaming</option>
          <option>Coffee</option>
          <option>Hiking</option>
        </select>

        <select
          required
          className="border p-2 rounded"
          onChange={(e)=>setPersonality(e.target.value)}
        >
          <option value="">Personality</option>
          <option>Introvert</option>
          <option>Extrovert</option>
          <option>Ambivert</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e)=>setPrefGender(e.target.value)}
        >
          <option value="">Preferred Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Any</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e)=>setPrefEthnicity(e.target.value)}
        >
          <option value="">Preferred Ethnicity</option>
          <option>East Asian</option>
          <option>South Asian</option>
          <option>White</option>
          <option>Hispanic</option>
          <option>Any</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e)=>setPrefReligion(e.target.value)}
        >
          <option value="">Preferred Religion</option>
          <option>None</option>
          <option>Christian</option>
          <option>Muslim</option>
          <option>Jewish</option>
          <option>Hindu</option>
          <option>Any</option>
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