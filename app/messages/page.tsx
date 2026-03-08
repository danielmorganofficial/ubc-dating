"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp
} from "firebase/firestore"

export default function Messages() {
  const router = useRouter()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [matchId, setMatchId] = useState<string | null>(null)
  const [matchProfile, setMatchProfile] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }
      setCurrentUserId(userId)

      try {
        const userSnap = await getDoc(doc(db, "users", userId))
        if (!userSnap.exists()) return

        const userData = userSnap.data()
        const mId = userData.matchId

        if (!mId) {
          setLoading(false)
          return
        }

        setMatchId(mId)

        // Load match profile
        const matchSnap = await getDoc(doc(db, "users", mId))
        if (matchSnap.exists()) {
          setMatchProfile(matchSnap.data().profile)
        }

        // Build stable chat ID from sorted user IDs
        const cId = [userId, mId].sort().join("_")
        setChatId(cId)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  // Subscribe to messages in real-time once chatId is ready
  useEffect(() => {
    if (!chatId || !currentUserId) return

    // Mark all messages as read when the page is opened
    setDoc(doc(db, "chats", chatId), { [`lastRead_${currentUserId}`]: Timestamp.now() }, { merge: true })
      .catch(() => {})

    const msgRef = collection(db, "chats", chatId, "messages")
    const q = query(msgRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      // Update lastRead every time new messages arrive while page is open
      setDoc(doc(db, "chats", chatId!), { [`lastRead_${currentUserId}`]: Timestamp.now() }, { merge: true })
        .catch(() => {})
    })

    return () => unsubscribe()
  }, [chatId, currentUserId])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !chatId || !currentUserId) return

    const msgText = text.trim()
    setText("")

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUserId,
      text: msgText,
      timestamp: serverTimestamp()
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin" />
      </div>
    )
  }

  if (!matchId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-10">
        <p className="text-6xl mb-4">💬</p>
        <h2 className="text-2xl font-bold mb-2">No match yet</h2>
        <p className="text-gray-500">You'll be able to message once you've been matched for the week.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-400 hover:text-gray-700 transition-colors text-xl"
        >
          ←
        </button>
        {matchProfile?.profilePicture && (
          <img
            src={matchProfile.profilePicture}
            alt="Match"
            className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
          />
        )}
        <div>
          <p className="font-bold text-gray-900 leading-tight">
            {matchProfile?.username || "Your Match"}
          </p>
          <p className="text-xs text-pink-500">Weekly Match</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-12">
            Say hello to {matchProfile?.username || "your match"} 👋
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-pink-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="bg-white border-t border-pink-100 px-4 py-3 flex gap-3 items-center"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </form>

    </div>
  )
}
