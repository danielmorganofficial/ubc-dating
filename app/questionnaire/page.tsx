"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function Questionnaire() {

  const router = useRouter()

  /* Preferences */

  const [prefGender,setPrefGender] = useState("")
  const [prefEthnicity,setPrefEthnicity] = useState("")
  const [prefReligion,setPrefReligion] = useState("")

  /* Lifestyle */

  const [socialLevel,setSocialLevel] = useState(3)
  const [partyLife,setPartyLife] = useState(3)
  const [exerciseImportance,setExerciseImportance] = useState(3)
  const [spontaneity,setSpontaneity] = useState(3)
  const [workLifeBalance,setWorkLifeBalance] = useState(3)


  function Scale({
    value,
    setValue
  }:{
    value:number
    setValue:(v:number)=>void
  }) {

    return (

      <div className="flex flex-col items-center w-full mb-4">

        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e)=>setValue(Number(e.target.value))}
          className="w-full accent-pink-500"
        />

        <div className="flex justify-between w-full text-sm text-gray-500 mt-1">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>

      </div>

    )

  }


  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    const userId = localStorage.getItem("userId")

    if(userId){

      await updateDoc(doc(db,"users",userId),{

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

    router.push("/dashboard")

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


        <form onSubmit={handleSubmit} className="form">


          <div className="section">
            Partner Preferences
          </div>


          <select
            className="input"
            value={prefGender}
            onChange={(e)=>setPrefGender(e.target.value)}
            required
          >
            <option value="">Preferred Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Any</option>
          </select>


          <select
            className="input"
            value={prefEthnicity}
            onChange={(e)=>setPrefEthnicity(e.target.value)}
            required
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
            value={prefReligion}
            onChange={(e)=>setPrefReligion(e.target.value)}
            required
          >
            <option value="">Preferred Religion</option>
            <option>None</option>
            <option>Christian</option>
            <option>Muslim</option>
            <option>Jewish</option>
            <option>Hindu</option>
            <option>Buddhist</option>
            <option>Any</option>
          </select>


          <div className="section">
            Lifestyle
          </div>


          <label>Social Activity</label>
          <Scale value={socialLevel} setValue={setSocialLevel}/>


          <label>Party / Nightlife</label>
          <Scale value={partyLife} setValue={setPartyLife}/>


          <label>Exercise Importance</label>
          <Scale value={exerciseImportance} setValue={setExerciseImportance}/>


          <label>Spontaneity</label>
          <Scale value={spontaneity} setValue={setSpontaneity}/>


          <label>Work–Life Balance</label>
          <Scale value={workLifeBalance} setValue={setWorkLifeBalance}/>


          <button className="button">
            Find My Match ❤️
          </button>


        </form>

      </div>

    </div>

  )

}