"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function Signup() {

    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        console.log("Form Submitted")

        try {
            const docRef = await addDoc(collection(db, "users"), {
                name,
                email
            })

            console.log("User saved:", docRef.id)

            localStorage.setItem("userId", docRef.id)

        } catch (error) {
            console.error("Firebase error:", error)
        }

        router.push("/questionnaire")
    }
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <h1 className="text-3xl font-bold mb-6">
                Sign Up
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-64"
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
                    placeholder="UBC Email"
                    className="border p-2 rounded"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

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