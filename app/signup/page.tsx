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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <h1 className="text-3xl font-bold mb-6">
        Create Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-80"
      >

        <input
          required
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          required
          type="number"
          min="18"
          max="99"
          placeholder="Age"
          className="border p-2 rounded"
          value={age}
          onChange={(e)=>setAge(e.target.value)}
        />

        <input
          required
          placeholder="UBC Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <select
          required
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          value={hobbies}
          onChange={(e)=>setHobbies(e.target.value)}
        />

        <select
          required
          className="border p-2 rounded"
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue
        </button>

      </form>

    </div>
  )
}