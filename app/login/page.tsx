"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

export default function Login(){

const router = useRouter()

const [name,setName] = useState("")
const [age,setAge] = useState("")
const [email,setEmail] = useState("")
const [error,setError] = useState("")

async function handleSubmit(e:React.FormEvent<HTMLFormElement>){

e.preventDefault()
setError("")

//if(!email.endsWith("ubc.ca")){
//setError("Please use your UBC email address.")
//return
//}

try{

const docRef = await addDoc(collection(db,"users"),{

profile:{
name,
age:Number(age),
email
}

})

localStorage.setItem("userId",docRef.id)

router.push("/profile-setup")

}catch(error){

console.error(error)
setError("Something went wrong. Please try again.")

}

}

return(

<div className="page">

<div className="card">

<h1 className="title">❤️ UBC Weekly Dating</h1>

<p className="subtitle">Login</p>

<form onSubmit={handleSubmit} className="form">

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

{error && <p style={{color:"red"}}>{error}</p>}

<button className="button">
Continue
</button>

</form>

</div>
</div>

)

}