"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export default function ProfileSetup(){

const router = useRouter()

const [profilePicture,setProfilePicture] = useState("")
const [username,setUsername] = useState("")
const [gender,setGender] = useState("")
const [ethnicity,setEthnicity] = useState("")
const [religion,setReligion] = useState("")
const [hobbies,setHobbies] = useState("")
const [mbti,setMbti] = useState("")
const [error,setError] = useState("")

async function handleSubmit(e:React.FormEvent<HTMLFormElement>){

e.preventDefault()
setError("")

const userId = localStorage.getItem("userId")

if(!userId){
router.push("/login")
return
}

try{

const userRef = doc(db,"users",userId)

await updateDoc(userRef,{
"profile.profilePicture":profilePicture,
"profile.username":username,
"profile.gender":gender,
"profile.ethnicity":ethnicity,
"profile.religion":religion,
"profile.hobbies":hobbies,
"profile.mbti":mbti
})

router.push("/questionnaire")

}catch(error){

console.error(error)
setError("Could not save profile.")

}

}

return(

<div className="page">

<div className="card">

<h1 className="title">❤️ UBC Weekly Dating</h1>

<p className="subtitle">Create your personalized account</p>

<form onSubmit={handleSubmit} className="form">

<input
className="input"
placeholder="Profile Picture URL"
value={profilePicture}
onChange={(e)=>setProfilePicture(e.target.value)}
/>

<input
className="input"
placeholder="Visible Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>

<select className="input" value={gender} onChange={(e)=>setGender(e.target.value)} required>
<option value="">Gender</option>
<option>Male</option>
<option>Female</option>
<option>Non-binary</option>
</select>

<select className="input" value={ethnicity} onChange={(e)=>setEthnicity(e.target.value)} required>
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

<select className="input" value={religion} onChange={(e)=>setReligion(e.target.value)}>
<option value="">Religion</option>
<option>None</option>
<option>Christian</option>
<option>Muslim</option>
<option>Jewish</option>
<option>Hindu</option>
<option>Buddhist</option>
</select>

<input
className="input"
placeholder="Hobbies (e.g. hiking, coffee)"
value={hobbies}
onChange={(e)=>setHobbies(e.target.value)}
/>

<select className="input" value={mbti} onChange={(e)=>setMbti(e.target.value)} required>
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

{error && <p style={{color:"red"}}>{error}</p>}

<button className="button">
Continue
</button>

</form>

</div>
</div>

)

}