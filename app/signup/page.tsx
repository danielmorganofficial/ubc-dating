"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function Signup() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  const [ethnicity, setEthnicity] = useState("")
  const [religion, setReligion] = useState("")
  const [hobbies, setHobbies] = useState("")
  const [mbti, setMbti] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!email.endsWith("@ubc.ca")) {
      alert("Please use a UBC email address")
      return
    }

    try {

      const docRef = await addDoc(collection(db, "users"), {

        profile: {
          name,
          age: Number(age),
          email,
          gender,
          ethnicity,
          religion,
          hobbies,
          mbti
        }

      })

      localStorage.setItem("userId", docRef.id)

    } catch (error) {

      console.error("Firebase error:", error)

    }

    router.push("/questionnaire")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white shadow-xl rounded-xl p-8 w-96">

        <h1 className="text-3xl font-bold mb-2 text-center">
          UBC Weekly Dating
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Create your profile
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            required
            placeholder="Name"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            required
            type="number"
            min="18"
            max="99"
            placeholder="Age"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={age}
            onChange={(e)=>setAge(e.target.value)}
          />

          <input
            required
            placeholder="UBC Email"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <select
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e)=>setGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>

          <select
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e)=>setEthnicity(e.target.value)}
          >
            <option value="">Ethnicity</option>
            <option>East Asian</option>
            <option>South Asian</option>
            <option>Black / African</option>
            <option>White / European</option>
            <option>Hispanic / Latino</option>
            <option>Middle Eastern</option>
            <option>Southeast Asian</option>
            <option>Mixed</option>
            <option>Other</option>
          </select>

          <select
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e)=>setReligion(e.target.value)}
          >
            <option value="">Religion</option>
            <option>None</option>
            <option>Christian</option>
            <option>Muslim</option>
            <option>Jewish</option>
            <option>Hindu</option>
            <option>Buddhist</option>
            <option>Sikh</option>
            <option>Other</option>
          </select>

          <input
            required
            placeholder="Hobbies (e.g. hiking, coffee, gym)"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={hobbies}
            onChange={(e)=>setHobbies(e.target.value)}
          />

          <select
            required
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e)=>setMbti(e.target.value)}
          >
            <option value="">MBTI Type</option>

            <option>INTJ</option>
            <option>INTP</option>
            <option>ENTJ</option>
            <option>ENTP</option>

            <option>INFJ</option>
            <option>INFP</option>
            <option>ENFJ</option>
            <option>ENFP</option>

            <option>ISTJ</option>
            <option>ISFJ</option>
            <option>ESTJ</option>
            <option>ESFJ</option>

            <option>ISTP</option>
            <option>ISFP</option>
            <option>ESTP</option>
            <option>ESFP</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 px-4 rounded w-full"
          >
            Continue
          </button>

        </form>

      </div>

    </div>
  )
}