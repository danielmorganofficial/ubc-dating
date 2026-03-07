"use client"

import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">UBC Weekly Dating</h1>

      <p className="mb-6">
        One curated campus date every week.
      </p>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
        onClick={() => router.push("/signup")}
      >
        Start Matching
      </button>

    </div>
  )

}