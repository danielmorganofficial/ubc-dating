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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white shadow-xl rounded-xl p-8 w-96">

        <h1 className="text-3xl font-bold text-center mb-2">
          Match Preferences
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Help us find your best match
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* Partner Preferences */}

          <h2 className="font-semibold text-lg mt-2">
            Partner Preferences
          </h2>

          <select
            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={(e)=>setPrefGender(e.target.value)}
          >
            <option value="">Preferred Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Any</option>
          </select>

          <select
            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={(e)=>setPrefEthnicity(e.target.value)}
          >
            <option value="">Preferred Ethnicity</option>
            <option>East Asian</option>
            <option>South Asian</option>
            <option>Black / African</option>
            <option>White / European</option>
            <option>Hispanic / Latino</option>
            <option>Middle Eastern</option>
            <option>Southeast Asian</option>
            <option>Mixed</option>
            <option>Any</option>
          </select>

          <select
            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400"
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

          {/* Lifestyle Questions */}

          <h2 className="font-semibold text-lg mt-4">
            Lifestyle
          </h2>


          {/* Social Level */}

          <label>
            How socially active are you on a typical week?
          </label>

          <div className="text-sm text-gray-500">
            {socialLevel} / 5
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={socialLevel}
            onChange={(e)=>setSocialLevel(Number(e.target.value))}
          />


          {/* Party Life */}

          <label>
            How much do you enjoy parties or nightlife?
          </label>

          <div className="text-sm text-gray-500">
            {partyLife} / 5
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={partyLife}
            onChange={(e)=>setPartyLife(Number(e.target.value))}
          />


          {/* Exercise */}

          <label>
            How important is exercise and physical health in your lifestyle?
          </label>

          <div className="text-sm text-gray-500">
            {exerciseImportance} / 5
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={exerciseImportance}
            onChange={(e)=>setExerciseImportance(Number(e.target.value))}
          />


          {/* Spontaneity */}

          <label>
            How spontaneous are you when making plans?
          </label>

          <div className="text-sm text-gray-500">
            {spontaneity} / 5
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={spontaneity}
            onChange={(e)=>setSpontaneity(Number(e.target.value))}
          />


          {/* Work-Life Balance */}

          <label>
            How important is maintaining work–life balance to you?
          </label>

          <div className="text-sm text-gray-500">
            {workLifeBalance} / 5
          </div>

          <input
            type="range"
            min="1"
            max="5"
            value={workLifeBalance}
            onChange={(e)=>setWorkLifeBalance(Number(e.target.value))}
          />


          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 px-4 rounded w-full mt-4"
          >
            Find My Match
          </button>

        </form>

      </div>

    </div>
  )
}