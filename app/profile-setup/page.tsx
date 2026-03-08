"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

import { Availability, DayOfWeek, TimeBlock } from "scheduler"

export default function ProfileSetup(){

const router = useRouter()

const [profilePicture,setProfilePicture] = useState("")
const [description,setDescription] = useState("")
const [username,setUsername] = useState("")
const [gender,setGender] = useState("")
const [isDragging, setIsDragging] = useState(false)
const [ethnicity,setEthnicity] = useState("")
const [religion,setReligion] = useState("")
const [mbti,setMbti] = useState("")

/* availability system */
const [availability, setAvailability] = useState<Availability[]>([])

const DAYS: DayOfWeek[] = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
const TIMES: TimeBlock[] = ["Morning","Afternoon","Evening"]

function toggleAvailability(day: DayOfWeek, time: TimeBlock) {

const exists = availability.some(a => a.day === day && a.time === time)

if (exists) {
setAvailability(availability.filter(a => !(a.day === day && a.time === time)))
} else {
setAvailability([...availability, { day, time }])
}

}


/* interests system */

const [interestInput,setInterestInput] = useState("")
const [interests,setInterests] = useState<string[]>([])

function addInterest(){

if(!interestInput.trim()) return

setInterests([...interests, interestInput.trim()])
setInterestInput("")

}

function removeInterest(index:number){
setInterests(interests.filter((_,i)=>i!==index))
}


async function handleSubmit(e:React.FormEvent<HTMLFormElement>){

e.preventDefault()

const userId = localStorage.getItem("userId")

if (!userId) {
router.push("/login")
return
}

try{

const userRef = doc(db, "users", userId)

await updateDoc(userRef, {

"profile.profilePicture": profilePicture,
"profile.description": description,
"profile.username": username,
"profile.gender": gender,
"profile.ethnicity": ethnicity,
"profile.religion": religion,
"profile.interests": interests,
"profile.mbti": mbti,
"profile.availability": availability

})

}catch(error){

console.error(error)

}

router.push("/questionnaire")

}


return(

<div className="page">

<div className="card">

<h1 className="title">❤️ UBC Weekly Dating</h1>

<p className="subtitle">Create your personalized account</p>

<form onSubmit={handleSubmit} className="form">

<div 
  className="input" 
  style={{
    display: "flex", 
    flexDirection: "column",
    alignItems: "center", 
    justifyContent: "center",
    minHeight: "150px", 
    border: isDragging ? "2px dashed #ec4899" : "2px dashed #ccc",
    background: isDragging ? "#fce7f3" : "transparent",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden"
  }}
  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={(e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  }}
  onClick={() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePicture(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }}
>
  {profilePicture ? (
    <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} />
  ) : (
    <div style={{ pointerEvents: "none", color: "#666", textAlign: "center" }}>
      <p style={{ fontWeight: "bold" }}>Upload Profile Picture</p>
      <p style={{ fontSize: "12px", marginTop: "4px" }}>Click to browse or drag & drop</p>
    </div>
  )}
</div>

<textarea
className="input"
placeholder="About Me (Description)"
value={description}
onChange={(e)=>setDescription(e.target.value)}
style={{ minHeight: "80px", resize: "vertical" }}
/>

<input
className="input"
placeholder="Visible Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
required
/>

<select
className="input"
value={gender}
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
value={ethnicity}
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
value={religion}
onChange={(e)=>setReligion(e.target.value)}
>
<option value="">Religion</option>
<option>None</option>
<option>Christian</option>
<option>Muslim</option>
<option>Jewish</option>
<option>Hindu</option>
<option>Buddhist</option>
</select>


{/* INTEREST INPUT */}

<div>

<div style={{display:"flex", gap:"8px"}}>

<input
className="input"
placeholder="Add an interest (hiking, coffee, gaming)"
value={interestInput}
onChange={(e)=>setInterestInput(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter"){
e.preventDefault()
addInterest()
}
}}
style={{flex:1}}
/>

<button
type="button"
onClick={addInterest}
style={{
width:"44px",
borderRadius:"10px",
border:"none",
background:"#ec4899",
color:"white",
fontSize:"20px",
cursor:"pointer"
}}
>
+
</button>

</div>

<div
style={{
display:"flex",
flexWrap:"wrap",
gap:"8px",
marginTop:"10px"
}}
>

{interests.map((interest,index)=>(

<div
key={index}
style={{
background:"#fce7f3",
padding:"6px 10px",
borderRadius:"20px",
display:"flex",
alignItems:"center",
gap:"6px"
}}
>

{interest}

<span
style={{cursor:"pointer"}}
onClick={()=>removeInterest(index)}
>
✕
</span>

</div>

))}

</div>

</div>


<select
className="input"
value={mbti}
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


{/* AVAILABILITY */}

<div className="section" style={{marginTop:"20px", marginBottom:"10px", fontWeight:"bold"}}>
Your Availability
</div>

<p style={{fontSize:"14px", color:"#666", marginBottom:"14px"}}>
Select when you're usually free for dates.
</p>

<div
style={{
display:"grid",
gridTemplateColumns:"auto 1fr 1fr 1fr",
gap:"8px",
width:"100%",
marginBottom:"20px"
}}
>

<div></div>

{TIMES.map(time => (
<div
key={time}
style={{
textAlign:"center",
fontWeight:"600",
color:"#555"
}}
>
{time}
</div>
))}

{DAYS.map(day => (

<div style={{display:"contents"}} key={day}>

<div
style={{
fontWeight:"600",
display:"flex",
alignItems:"center",
justifyContent:"flex-end",
paddingRight:"10px",
color:"#555"
}}
>
{day.slice(0,3)}
</div>

{TIMES.map(time => {

const isSelected = availability.some(a => a.day === day && a.time === time)

return(

<div
key={`${day}-${time}`}
onClick={() => toggleAvailability(day,time)}
style={{
background: isSelected ? "#ec4899" : "#f3f4f6",
height:"44px",
borderRadius:"8px",
cursor:"pointer",
display:"flex",
alignItems:"center",
justifyContent:"center",
border: isSelected ? "none" : "1px solid #e5e7eb",
transition:"all 0.15s"
}}
>

{isSelected && (
<span style={{color:"white", fontWeight:"bold"}}>✓</span>
)}

</div>

)

})}

</div>

))}

</div>


<button className="button">
Continue
</button>

</form>

</div>

</div>

)

}