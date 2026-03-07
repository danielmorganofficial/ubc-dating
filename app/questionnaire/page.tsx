"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function Questionnaire() {

    const router = useRouter()

    const [hobby, setHobby] = useState("")
    const [personality, setPersonality] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // try {

        //     await addDoc(collection(db, "preferences"), {
        //         hobby: hobby,
        //         personality: personality
        //     })

        //     router.push("/match")

        // } catch (error) {
        //     console.error("Error saving preferences: ", error)
        // }

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
                    className="border p-2 rounded"
                    onChange={(e)=>setHobby(e.target.value)}
                >
                    <option value="">Favorite Hobby</option>
                    <option>Gym</option>
                    <option>Gaming</option>
                    <option>Cooking</option>
                    <option>Hiking</option>
                </select>

                <select
                    className="border p-2 rounded"
                    onChange={(e)=>setPersonality(e.target.value)}
                >
                    <option value="">Personality</option>
                    <option>Introvert</option>
                    <option>Extrovert</option>
                    <option>Ambivert</option>
                </select>

                <button className="bg-blue-500 text-white p-2 rounded" type="submit">
                    Find My Date
                </button>

            </form>

        </div>
    )
      
    }
