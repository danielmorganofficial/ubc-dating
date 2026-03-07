"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function Signup() {

  const router = useRouter()

  const [name,setName] = useState("")
  const [age,setAge] = useState("")
  const [email,setEmail] = useState("")
  const [gender,setGender] = useState("")
  const [ethnicity,setEthnicity] = useState("")
  const [religion,setReligion] = useState("")
  const [hobbies,setHobbies] = useState("")
  const [mbti,setMbti] = useState("")

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    try{

      const docRef = await addDoc(collection(db,"users"),{

        profile:{
          name,
          age:Number(age),
          email,
          gender,
          ethnicity,
          religion,
          hobbies,
          mbti
        }

      })

      localStorage.setItem("userId",docRef.id)

    }catch(error){

      console.error(error)

    }

    router.push("/questionnaire")
  }

  return (

    <div className="page">

      <div className="card">

        <h1 className="title">
          ❤️ UBC Weekly Dating
        </h1>

        <p className="subtitle">
          Create your profile
        </p>

        <form
          onSubmit={handleSubmit}
          className="form"
        >

          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            className="input"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e)=>setAge(e.target.value)}
            required
          />

          <input
            className="input"
            placeholder="UBC Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <select
            className="input"
            onChange={(e)=>setGender(e.target.value)}
            required
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
          </select>

          <select
            className="input"
            onChange={(e)=>setEthnicity(e.target.value)}
            required
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
          </select>

          <select
            className="input"
            onChange={(e)=>setReligion(e.target.value)}
            required
          >
            <option value="">Religion</option>
            <option>None</option>
            <option>Christian</option>
            <option>Muslim</option>
            <option>Jewish</option>
            <option>Hindu</option>
            <option>Buddhist</option>
            <option>Sikh</option>
          </select>

          <input
            className="input"
            placeholder="Hobbies (e.g. hiking, coffee)"
            value={hobbies}
            onChange={(e)=>setHobbies(e.target.value)}
          />

          <select
            className="input"
            onChange={(e)=>setMbti(e.target.value)}
            required
          >
            <option value="">MBTI</option>
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

          <button className="button">
            Continue
          </button>

        </form>

      </div>

    </div>

  )

}