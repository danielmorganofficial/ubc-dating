"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

export default function Login(){

const router = useRouter()

const [isLogin, setIsLogin] = useState(false)
const [name,setName] = useState("")
const [age,setAge] = useState("")
const [email,setEmail] = useState("")
const [phone,setPhone] = useState("")
const [error,setError] = useState("")

async function handleSubmit(e:React.FormEvent<HTMLFormElement>){

e.preventDefault()
setError("")

if(isLogin) {
  try {
    const qEmail = query(collection(db, "users"), where("profile.email", "==", email))
    const qUsername = query(collection(db, "users"), where("profile.username", "==", email))

    const [snapEmail, snapUsername] = await Promise.all([getDocs(qEmail), getDocs(qUsername)])
    
    let userDoc = null
    if (!snapEmail.empty) {
      userDoc = snapEmail.docs[0]
    } else if (!snapUsername.empty) {
      userDoc = snapUsername.docs[0]
    }

    if (!userDoc) {
      setError("Account not found. Please go to the register page.")
      return
    }

    localStorage.setItem("userId", userDoc.id)
    router.push("/dashboard")
  } catch(err) {
    console.error(err)
    setError("Something went wrong. Please try again.")
  }
} else {
  try{

  const qEmail = query(collection(db, "users"), where("profile.email", "==", email))
  const snapEmail = await getDocs(qEmail)
  
  if (!snapEmail.empty) {
    setError("This email is already in use.")
    return
  }

  const docRef = await addDoc(collection(db,"users"),{

  profile:{
  name,
  age:Number(age),
  email,
  phone
  }

  })

  localStorage.setItem("userId",docRef.id)

  router.push("/profile-setup")

  }catch(error){

  console.error(error)
  setError("Something went wrong. Please try again.")

  }
}

}

return(

<div className="page">

<div className="card">

<h1 className="title">❤️ UBC Weekly Dating</h1>

<p className="subtitle">{isLogin ? "Login" : "Register"}</p>

<form onSubmit={handleSubmit} className="form">

{!isLogin && (
<>
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
</>
)}

<input
className="input"
type={isLogin ? "text" : "email"}
placeholder={isLogin ? "Email or Username" : "Email"}
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

{!isLogin && (
<input
className="input"
placeholder="Phone Number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
required
/>
)}

{error && <p style={{color:"red", marginBottom: "10px"}}>{error}</p>}

<button type="submit" className="button">
{isLogin ? "Login" : "Continue"}
</button>

</form>

<div style={{marginTop: "15px", textAlign: "center"}}>
<button 
type="button" 
onClick={() => { setIsLogin(!isLogin); setError(""); }} 
style={{background: "none", border: "none", color: "#db2777", cursor: "pointer", textDecoration: "underline", fontSize: "14px", fontWeight: "500"}}
>
{isLogin ? "Need an account? Register instead" : "Already have an account? Login here"}
</button>
</div>

</div>
</div>

)

}