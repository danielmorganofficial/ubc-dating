"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function Questionnaire() {

  const router = useRouter()

  const [prefGender, setPrefGender] = useState("")
  const [prefEthnicity, setPrefEthnicity] = useState("")
  const [prefReligion, setPrefReligion] = useState("")

  const [socialLevel, setSocialLevel] = useState(3)
  const [partyLife, setPartyLife] = useState(3)
  const [exerciseImportance, setExerciseImportance] = useState(3)
  const [spontaneity, setSpontaneity] = useState(3)
  const [workLifeBalance, setWorkLifeBalance] = useState(3)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {

      const userId = localStorage.getItem("userId")

      if (userId) {

        const userRef = doc(db, "users", userId)

        await updateDoc(userRef, {

          preferences: {
            gender: prefGender,
            ethnicity: prefEthnicity,
            religion: prefReligion
          },

          questionnaire: {
            socialLevel,
            partyLife,
            exerciseImportance,
            spontaneity,
            workLifeBalance
          }

        })

      }

    } catch (error) {

      console.error("Error saving questionnaire:", error)

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
        className="flex flex-col gap-4 w-80"
      >

        {/* Preferences */}

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
          <option>Black</option>
          <option>White</option>
          <option>Hispanic / Latino</option>
          <option>Middle Eastern</option>
          <option>Mixed</option>
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
          <option>Buddhist</option>
          <option>Other</option>
          <option>Any</option>
        </select>


        {/* Questionnaire Section */}

        <h2 className="text-xl font-semibold mt-4">
          Lifestyle Questions
        </h2>


        <label>
        How socially active are you on a typical week?
        </label>

        <input
          type="range"
          min="1"
          max="5"
          value={socialLevel}
          onChange={(e)=>setSocialLevel(Number(e.target.value))}
        />



        <label>
        How much do you enjoy parties or nightlife?
        </label>

        <input
          type="range"
          min="1"
          max="5"
          value={partyLife}
          onChange={(e)=>setPartyLife(Number(e.target.value))}
        />



        <label>
        How important is exercise and physical health in your lifestyle?
        </label>

        <input
          type="range"
          min="1"
          max="5"
          value={exerciseImportance}
          onChange={(e)=>setExerciseImportance(Number(e.target.value))}
        />



        <label>
        How spontaneous are you when making plans?
        </label>

        <input
          type="range"
          min="1"
          max="5"
          value={spontaneity}
          onChange={(e)=>setSpontaneity(Number(e.target.value))}
        />



        <label>
        How important is maintaining work–life balance to you?
        </label>

        <input
          type="range"
          min="1"
          max="5"
          value={workLifeBalance}
          onChange={(e)=>setWorkLifeBalance(Number(e.target.value))}
        />


        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Find My Match
        </button>

      </form>

    </div>
  )
}