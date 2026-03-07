"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc,updateDoc } from "firebase/firestore"

export default function Questionnaire(){

const router = useRouter()

const [socialLevel,setSocialLevel] = useState(3)
const [partyLife,setPartyLife] = useState(3)
const [exerciseImportance,setExerciseImportance] = useState(3)
const [spontaneity,setSpontaneity] = useState(3)
const [workLifeBalance,setWorkLifeBalance] = useState(3)

function Scale({value,setValue}){

return(

<div className="scale-row">

{[1,2,3,4,5].map(num=>(
<div
key={num}
className={`scale-btn ${value===num ? "active":""}`}
onClick={()=>setValue(num)}
>
{num}
</div>
))}

</div>

)

}

async function handleSubmit(e){

e.preventDefault()

const userId = localStorage.getItem("userId")

if(userId){

await updateDoc(doc(db,"users",userId),{

questionnaire:{
socialLevel,
partyLife,
exerciseImportance,
spontaneity,
workLifeBalance
}

})

}

router.push("/match")

}

return(

<div className="page">

<div className="card">

<h1 className="title">Lifestyle</h1>

<p className="subtitle">
Help us understand your lifestyle
</p>

<form onSubmit={handleSubmit} className="form">

<label>Social Activity</label>
<Scale value={socialLevel} setValue={setSocialLevel}/>

<label>Party / Nightlife</label>
<Scale value={partyLife} setValue={setPartyLife}/>

<label>Exercise Importance</label>
<Scale value={exerciseImportance} setValue={setExerciseImportance}/>

<label>Spontaneity</label>
<Scale value={spontaneity} setValue={setSpontaneity}/>

<label>Work-Life Balance</label>
<Scale value={workLifeBalance} setValue={setWorkLifeBalance}/>

<button className="button">
Find My Match ❤️
</button>

</form>

</div>

</div>

)

}