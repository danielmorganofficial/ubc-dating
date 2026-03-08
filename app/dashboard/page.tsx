"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore"

type Availability = { day: string; time: string }

type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday"

type TimeBlock = "Morning" | "Afternoon" | "Evening"


function suggestMatchDate(
  a1: Availability[],
  a2: Availability[]
): Availability | null {

  for (const slot of a1) {
    const match = a2.find(
      (s) => s.day === slot.day && s.time === slot.time
    )

    if (match) {
      return slot
    }
  }

  return null
}

function calculateCompatibility(userA: any, userB: any) {

  let score = 0

  const aProfile = userA.profile || {}
  const bProfile = userB.profile || {}

  const aPref = userA.preferences || {}
  const bPref = userB.preferences || {}

  const aQ = userA.questionnaire || {}
  const bQ = userB.questionnaire || {}


  // Gender preference check

  const aLikesB =
    aPref.gender === "Any" ||
    aPref.gender === bProfile.gender

  const bLikesA =
    bPref.gender === "Any" ||
    bPref.gender === aProfile.gender

  if (!aLikesB || !bLikesA) return -1

  score += 20


  // Ethnicity preference

  if (aPref.ethnicity === "Any" || aPref.ethnicity === bProfile.ethnicity) {
    score += 5
  }

  if (bPref.ethnicity === "Any" || bPref.ethnicity === aProfile.ethnicity) {
    score += 5
  }


  // Religion preference

  if (aPref.religion === "Any" || aPref.religion === bProfile.religion) {
    score += 5
  }

  if (bPref.religion === "Any" || bPref.religion === aProfile.religion) {
    score += 5
  }


  // MBTI similarity

  if (aProfile.mbti && bProfile.mbti) {

    if (aProfile.mbti[0] === bProfile.mbti[0]) score += 3
    if (aProfile.mbti[1] === bProfile.mbti[1]) score += 3
    if (aProfile.mbti[2] === bProfile.mbti[2]) score += 3
    if (aProfile.mbti[3] === bProfile.mbti[3]) score += 3

  }


  // Shared interests

  const aInterests = aProfile.interests || []
  const bInterests = bProfile.interests || []

  const shared = aInterests.filter((i: string) =>
    bInterests.includes(i)
  )

  score += shared.length * 4


  // Lifestyle similarity

  function similarity(a: number, b: number) {
    return 5 - Math.abs(a - b)
  }

  score += similarity(aQ.socialLevel, bQ.socialLevel)
  score += similarity(aQ.partyLife, bQ.partyLife)
  score += similarity(aQ.exerciseImportance, bQ.exerciseImportance)
  score += similarity(aQ.spontaneity, bQ.spontaneity)
  score += similarity(aQ.workLifeBalance, bQ.workLifeBalance)

  return Math.min(score, 100)

}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"match" | "profile" | "questionnaire">("match")
  const [loading, setLoading] = useState(true)

  // User Data
  const [userDoc, setUserDoc] = useState<any>(null)

  // Match Data
  const [match, setMatch] = useState<any>(null)
  const [matchCompatibility, setMatchCompatibility] = useState<number | null>(null)
  const [dateIdeaDescription, setDateIdeaDescription] = useState<string | null>(null)
  const [dateSuggestion, setDateSuggestion] = useState<Availability | null>(null)

  // Profile Form Data
  const [profilePicture, setProfilePicture] = useState("")
  const [description, setDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [ethnicity, setEthnicity] = useState("")
  const [religion, setReligion] = useState("")
  const [mbti, setMbti] = useState("")
  const [interestInput, setInterestInput] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])

  const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const TIMES: TimeBlock[] = ["Morning", "Afternoon", "Evening"]

  // Questionnaire Form Data
  const [prefGender, setPrefGender] = useState("")
  const [prefEthnicity, setPrefEthnicity] = useState("")
  const [prefReligion, setPrefReligion] = useState("")
  const [socialLevel, setSocialLevel] = useState(3)
  const [partyLife, setPartyLife] = useState(3)
  const [exerciseImportance, setExerciseImportance] = useState(3)
  const [spontaneity, setSpontaneity] = useState(3)
  const [workLifeBalance, setWorkLifeBalance] = useState(3)

  useEffect(() => {
    async function loadData() {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }

      try {
        const userRef = doc(db, "users", userId)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          setUserDoc(userData)

          // Load Profile Data
          if (userData.profile) {
            setProfilePicture(userData.profile.profilePicture || "")
            setDescription(userData.profile.description || "")
            setUsername(userData.profile.username || "")
            setPhone(userData.profile.phone || "")
            setGender(userData.profile.gender || "")
            setEthnicity(userData.profile.ethnicity || "")
            setReligion(userData.profile.religion || "")
            setMbti(userData.profile.mbti || "")
            setInterests(userData.profile.interests || [])
            setAvailability(userData.profile.availability || [])
          }

          // Load Questionnaire Data
          if (userData.preferences) {
            setPrefGender(userData.preferences.gender || "")
            setPrefEthnicity(userData.preferences.ethnicity || "")
            setPrefReligion(userData.preferences.religion || "")
          }
          if (userData.questionnaire) {
            setSocialLevel(userData.questionnaire.socialLevel || 3)
            setPartyLife(userData.questionnaire.partyLife || 3)
            setExerciseImportance(userData.questionnaire.exerciseImportance || 3)
            setSpontaneity(userData.questionnaire.spontaneity || 3)
            setWorkLifeBalance(userData.questionnaire.workLifeBalance || 3)
          }

          // Load Match Data
          if (userData.matchId) {
            // Already has a match
            const matchUserSnap = await getDoc(doc(db, "users", userData.matchId))
            if (matchUserSnap.exists()) {
              setMatch({ id: matchUserSnap.id, ...matchUserSnap.data() })
              
              if (userData.matchCompatibility) setMatchCompatibility(userData.matchCompatibility)
              if (userData.matchIdeaDescription) setDateIdeaDescription(userData.matchIdeaDescription)
              if (userData.matchSuggestion) setDateSuggestion(userData.matchSuggestion)
            }
          } else {
            // Find a new match
            const querySnapshot = await getDocs(collection(db, "users"))
            const availableUsers: any[] = []
            let currentUser: any = null

            querySnapshot.forEach((d) => {
              const data = d.data()
              if (d.id === userId) {
                currentUser = { id: d.id, ...data }
              } else if (!data.matchId) { // Only unmatched users
                availableUsers.push({ id: d.id, ...data })
              }
            })

            if (currentUser && availableUsers.length > 0) {

              let bestMatch: any = null
              let bestScore = -1

              availableUsers.forEach((u: any) => {

                const score = calculateCompatibility(currentUser, u)

                if (score > bestScore) {
                  bestScore = score
                  bestMatch = u
                }

              })

              if (bestMatch) {

                const suggestion =
                  suggestMatchDate(
                    currentUser.profile?.availability || [],
                    bestMatch.profile?.availability || []
                  ) || { day: "Tuesday", time: "Evening" }


                let dateIdeaText = ""
                // Preemptively decide location so we can feed it to Gemini
                const locations = ["Blue Chip Cafe", "Nitobe Garden", "Wreck Beach", "Great Dane Coffee", "UBC Rose Garden"]
                const prePickedLocation = locations[Math.floor(Math.random() * locations.length)]

                try {
                  const ideaRes = await fetch("/api/generateDateIdea", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userAName: currentUser.profile?.username || currentUser.name || "User",
                      userAInterests: currentUser.profile?.interests || [],
                      userBName: bestMatch.profile?.username || bestMatch.name || "Match",
                      userBInterests: bestMatch.profile?.interests || [],
                      suggestedLocation: prePickedLocation
                    })
                  })
                  if(ideaRes.ok) {
                    const ideaData = await ideaRes.json()
                    if (ideaData.dateIdea) dateIdeaText = ideaData.dateIdea
                  }
                } catch (e) {
                  console.error("Failed to fetch custom date idea", e)
                }

                await updateDoc(doc(db, "users", userId), {
                  matchId: bestMatch.id,
                  matchSuggestion: suggestion,
                  matchCompatibility: bestScore,
                  matchIdeaDescription: dateIdeaText,
                  matchLocation: prePickedLocation
                })

                await updateDoc(doc(db, "users", bestMatch.id), {
                  matchId: userId,
                  matchSuggestion: suggestion,
                  matchCompatibility: bestScore,
                  matchIdeaDescription: dateIdeaText,
                  matchLocation: prePickedLocation
                })

                setMatch(bestMatch)
                setDateSuggestion(suggestion)
                setMatchCompatibility(bestScore)
                setDateIdeaDescription(dateIdeaText)

                await fetch("/api/sendMatchEmail",{
                method:"POST",
                headers:{
                "Content-Type":"application/json"
                },
                body:JSON.stringify({
                email: currentUser.profile.email,
                matchName: bestMatch.profile.name,
                matchEmail: bestMatch.profile.email,
                matchPhone: bestMatch.profile.phone
                })
                })

              }

            }
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Handlers for Profile
  function toggleAvailability(day: DayOfWeek, time: TimeBlock) {
    const exists = availability.some(a => a.day === day && a.time === time)
    if (exists) {
      setAvailability(availability.filter(a => !(a.day === day && a.time === time)))
    } else {
      setAvailability([...availability, { day, time }])
    }
  }

  function addInterest() {
    if (!interestInput.trim()) return
    setInterests([...interests, interestInput.trim()])
    setInterestInput("")
  }

  function removeInterest(index: number) {
    setInterests(interests.filter((_, i) => i !== index))
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    if (!userId) return

    try {
      await updateDoc(doc(db, "users", userId), {
        "profile.profilePicture": profilePicture,
        "profile.description": description,
        "profile.username": username,
        "profile.phone": phone,
        "profile.gender": gender,
        "profile.ethnicity": ethnicity,
        "profile.religion": religion,
        "profile.interests": interests,
        "profile.mbti": mbti,
        "profile.availability": availability
      })
      alert("Profile updated successfully!")
    } catch (err) {
      console.error(err)
      alert("Error saving profile")
    }
  }

  // Handlers for Questionnaire
  async function handleSaveQuestionnaire(e: React.FormEvent) {
    e.preventDefault()
    const userId = localStorage.getItem("userId")
    if (!userId) return

    try {
      await updateDoc(doc(db, "users", userId), {
        preferences: {
          gender: prefGender,
          ethnicity: prefEthnicity,
          religion: prefReligion
        },
        questionnaire: {
          socialLevel,
          partyLife,
          exerciseImportance,
          spontaneity,
          workLifeBalance
        }
      })
      alert("Preferences updated successfully!")
    } catch (err) {
      console.error(err)
      alert("Error saving preferences")
    }
  }

  function handleLogout() {
    localStorage.removeItem("userId")
    router.push("/login")
  }

  // Components
  function Scale({ value, setValue }: { value: number, setValue: (v: number) => void }) {
    return (
      <div className="w-full">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none accent-pink-500 cursor-pointer"
        />

        <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="p-10 text-center">Loading your dashboard...</div>
  }

  const locations = ["Blue Chip Cafe", "Nitobe Garden", "Wreck Beach", "Great Dane Coffee", "UBC Rose Garden"]
  const suggestedLocation = locations[Math.floor(Math.random() * locations.length)]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 text-gray-900 pb-20">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between border-b">
          <h1 className="font-bold text-xl text-pink-600">❤️ UBC Dating Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto px-4 flex gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("match")}
            className={`py-3 font-medium text-sm border-b-2 transition-all duration-200 ${activeTab === "match" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Weekly Match
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 font-medium text-sm border-b-2 transition-all duration-200 ${activeTab === "profile" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("questionnaire")}
            className={`py-3 font-medium text-sm border-b-2 transition-all duration-200 ${activeTab === "questionnaire" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Preferences
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-8">

        {/* TAB 1: MATCH */}
        {activeTab === "match" && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-bold mb-2">Your Weekly Match ❤️</h2>

            {!match ? (
              <p className="text-gray-500 mt-8">Finding someone special for you...</p>
            ) : (
              <div className="mt-8">
                {match.profile?.profilePicture && (
                  <img src={match.profile.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-pink-100 shadow-md" />
                )}

                <h3 className="text-2xl font-semibold mb-1">
                  Meet {match.profile?.username || match.name || "someone special"}
                </h3>

                {matchCompatibility !== null && (
                  <div className="inline-block bg-pink-100 text-pink-800 px-4 py-1 rounded-full text-lg font-semibold my-2">
                    {matchCompatibility}% Compatible
                  </div>
                )}

                {match.profile?.description && (
                  <p className="text-gray-700 italic my-3 text-lg">"{match.profile.description}"</p>
                )}

                <div className="text-gray-500 text-sm mb-6 space-y-1">
                  <p>📧 {match.profile?.email}</p>
                  <p>📱 {match.profile?.phone}</p>
                </div>

                <p className="text-gray-600 mb-8 text-lg">
                  They also like: <span className="font-medium text-pink-600">{match.profile?.interests?.[0] || match.hobby || "hanging out"}</span>
                </p>

                <div className="bg-pink-50 rounded-xl p-6 inline-block text-left border border-pink-100 max-w-md mx-auto">
                  <p className="font-bold text-pink-800 text-sm uppercase tracking-wider mb-2">Suggested Date</p>
                  <p className="text-xl font-medium text-pink-900">
                    📍 {match.matchLocation || "UBC Campus"}
                  </p>
                  <p className="text-lg text-pink-800 mt-1 mb-3">
                    🕒 {dateSuggestion ? `${dateSuggestion.day} ${dateSuggestion.time}` : "Tuesday 6PM"}
                  </p>
                  
                  {dateIdeaDescription && (
                    <div className="pt-3 border-t border-pink-200 mt-2">
                      <p className="text-sm text-pink-800 leading-relaxed font-medium">✨ {dateIdeaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

            <div className="mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
              <img 
                src={profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                alt="Profile" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900">{username || "No Username Setup"}</h3>
                {description && <p className="text-gray-600 mt-2 italic">"{description}"</p>}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 border-b pb-2">Edit Details</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Profile Picture</label>
                  <div
                    className="input w-full"
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
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">About Me (Description)</label>
                  <textarea
                    className="input w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ minHeight: "80px", resize: "vertical" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visible Username</label>
                  <input className="input w-full" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input className="input w-full" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select className="input w-full" value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option><option>Non-binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                  <select className="input w-full" value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} required>
                    <option value="">Select Ethnicity</option>
                    <option>East Asian</option><option>South Asian</option><option>Black / African</option>
                    <option>White / European</option><option>Hispanic / Latino</option><option>Middle Eastern</option>
                    <option>Southeast Asian</option><option>Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <select className="input w-full" value={religion} onChange={(e) => setReligion(e.target.value)}>
                    <option value="">Select Religion</option>
                    <option>None</option><option>Christian</option><option>Muslim</option>
                    <option>Jewish</option><option>Hindu</option><option>Buddhist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MBTI Type</label>
                  <select className="input w-full" value={mbti} onChange={(e) => setMbti(e.target.value)} required>
                    <option value="">Select MBTI</option>
                    <option>INTJ</option><option>INTP</option><option>ENTJ</option><option>ENTP</option>
                    <option>INFJ</option><option>INFP</option><option>ENFJ</option><option>ENFP</option>
                    <option>ISTJ</option><option>ISFJ</option><option>ESTJ</option><option>ESFJ</option>
                    <option>ISTP</option><option>ISFP</option><option>ESTP</option><option>ESFP</option>
                  </select>
                </div>
              </div>

              {/* Interests Section */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Interests & Hobbies</label>
                <div className="flex gap-2 mb-3">
                  <input
                    className="input flex-1"
                    placeholder="Add an interest (e.g. hiking, coffee, gaming)"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addInterest()
                      }
                    }}
                  />
                  <button type="button" onClick={addInterest} className="bg-pink-500 hover:bg-pink-600 text-white w-12 rounded-xl text-xl flex items-center justify-center transition-colors">
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div key={index} className="bg-pink-100 text-pink-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium">
                      {interest}
                      <button type="button" className="opacity-60 hover:opacity-100 transition-opacity" onClick={() => removeInterest(index)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability Section */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Your Availability</h3>
                <p className="text-sm text-gray-500 mb-4">Select all times you are generally free for dates.</p>

                <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-3 w-full text-sm">
                  <div className="p-2"></div>
                  {TIMES.map(time => <div key={time} className="text-center font-semibold text-gray-500 p-2">{time}</div>)}

                  {DAYS.map(day => (
                    <div className="contents" key={day}>
                      <div className="text-right pr-4 font-medium text-gray-600 flex items-center justify-end h-10">{day.slice(0, 3)}</div>
                      {TIMES.map(time => {
                        const isSelected = availability.some(a => a.day === day && a.time === time);
                        return (
                          <div
                            key={`${day}-${time}`}
                            onClick={() => toggleAvailability(day, time)}
                            className={`h-12 w-full rounded-xl cursor-pointer flex items-center justify-center transition-all ${isSelected ? "bg-pink-500 text-white shadow-sm" : "bg-gray-100 text-transparent hover:bg-gray-200"
                              }`}
                          >
                            {isSelected && "✓"}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="button w-full">Save Profile Changes</button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: QUESTIONNAIRE / PREFERENCES */}
        {activeTab === "questionnaire" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Match Preferences</h2>

            <form onSubmit={handleSaveQuestionnaire} className="space-y-6">

              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Partner Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gender</label>
                    <select className="input w-full" value={prefGender} onChange={(e) => setPrefGender(e.target.value)}>
                      <option value="">Any</option><option>Male</option><option>Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Ethnicity</label>
                    <select className="input w-full" value={prefEthnicity} onChange={(e) => setPrefEthnicity(e.target.value)}>
                      <option value="">Any</option><option>East Asian</option><option>South Asian</option>
                      <option>Black / African</option><option>White / European</option><option>Hispanic / Latino</option>
                      <option>Middle Eastern</option><option>Southeast Asian</option><option>Mixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Religion</label>
                    <select className="input w-full" value={prefReligion} onChange={(e) => setPrefReligion(e.target.value)}>
                      <option value="">Any</option><option>None</option><option>Christian</option>
                      <option>Muslim</option><option>Jewish</option><option>Hindu</option><option>Buddhist</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Lifestyle Alignment</h3>
                <div className="space-y-8 w-full max-w-2xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Activity Level</label>
                    <Scale value={socialLevel} setValue={setSocialLevel} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Party / Nightlife Interest</label>
                    <Scale value={partyLife} setValue={setPartyLife} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Importance of Exercise</label>
                    <Scale value={exerciseImportance} setValue={setExerciseImportance} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spontaneity</label>
                    <Scale value={spontaneity} setValue={setSpontaneity} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work–Life Balance</label>
                    <Scale value={workLifeBalance} setValue={setWorkLifeBalance} />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="button w-full">Save Match Preferences</button>
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  )
}
