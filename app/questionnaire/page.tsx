"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function Questionnaire() {

  const router = useRouter()

  const [prefGender,setPrefGender] = useState("")
  const [prefEthnicity,setPrefEthnicity] = useState("")
  const [prefReligion,setPrefReligion] = useState("")

  const [socialLevel,setSocialLevel] = useState(3)
  const [partyLife,setPartyLife] = useState(3)
  const [exerciseImportance,setExerciseImportance] = useState(3)
  const [spontaneity,setSpontaneity] = useState(3)
  const [workLifeBalance,setWorkLifeBalance] = useState(3)

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    try {

      const userId = localStorage.getItem("userId")

      if(userId){

        const userRef = doc(db,"users",userId)

        await updateDoc(userRef,{

          preferences:{
            gender:prefGender,
            ethnicity:prefEthnicity,
            religion:prefReligion
          },

          questionnaire:{
            socialLevel,
            partyLife,
            exerciseImportance,
            spontaneity,
            workLifeBalance
          }

        })

      }

    } catch(error) {

      console.error(error)

    }

    router.push("/match")

  }

  return (

    <div className="page">

      <div className="card">

        <h1 className="title">
          Match Preferences
        </h1>

        <p className="subtitle">
          Tell us what you're looking for
        </p>

        <form
          onSubmit={handleSubmit}
          className="form"
        >

          <div className="section">
            Partner Preferences
          </div>

          <select
            className="input"
            onChange={(e)=>setPrefGender(e.target.value)}
          >
            <option value="">Preferred Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Any</option>
          </select>

          <select
            className="input"
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
            className="input"
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


          <div className="section">
            Lifestyle
          </div>


          <label>
            Social Activity Level ({socialLevel}/5)
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={socialLevel}
            onChange={(e)=>setSocialLevel(Number(e.target.value))}
          />


          <label>
            Enjoyment of Parties / Nightlife ({partyLife}/5)
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={partyLife}
            onChange={(e)=>setPartyLife(Number(e.target.value))}
          />


          <label>
            Importance of Exercise ({exerciseImportance}/5)
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={exerciseImportance}
            onChange={(e)=>setExerciseImportance(Number(e.target.value))}
          />


          <label>
            Spontaneity ({spontaneity}/5)
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={spontaneity}
            onChange={(e)=>setSpontaneity(Number(e.target.value))}
          />


          <label>
            Work–Life Balance Priority ({workLifeBalance}/5)
          </label>

          <input
            type="range"
            min="1"
            max="5"
            value={workLifeBalance}
            onChange={(e)=>setWorkLifeBalance(Number(e.target.value))}
          />

          <button className="button">
            Find My Match ❤️
          </button>

        </form>

      </div>

    </div>

  )

}