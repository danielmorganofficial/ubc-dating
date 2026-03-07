"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  // phase: 0=idle, 1=draw bow, 2=shoot arrow
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let t1: NodeJS.Timeout
    let t2: NodeJS.Timeout
    let loopTimeout: NodeJS.Timeout

    function playAnim() {
      setPhase(0)
      t1 = setTimeout(() => setPhase(1), 500) // Draw bow
      t2 = setTimeout(() => setPhase(2), 3000) // Shoot arrow
      // 3000 (wait) + 8000 (shoot) = 11000m, reset completely after 11.5s
      loopTimeout = setTimeout(playAnim, 11500)
    }

    playAnim()

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(loopTimeout)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 overflow-hidden bg-pink-50">
      
      {/* Cupid Animation Layer - Centered Left */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-start pl-4 md:pl-20">
        <div 
          className="relative transition-transform duration-[2000ms] ease-in-out sm:scale-125 md:scale-150"
          style={{ transform: phase >= 1 ? 'rotate(-5deg)' : 'rotate(0deg)' }}
        >
          {/* Cupid Image */}
          <img 
            src="/cupid.png" 
            alt="Cupid" 
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-xl z-20 relative"
          />

          {/* Heart Tip Arrow */}
          <div 
            className="absolute top-1/2 right-4 md:-right-8 -translate-y-1/2 flex items-center z-30"
            style={{
              transitionProperty: "transform, opacity",
              // phase 2: slow shoot (8s), phase 1: draw slowly (2.5s)
              transitionDuration: phase === 2 ? "8s, 0s" : phase === 1 ? "2.5s, 0s" : "0s, 0s",
              transitionTimingFunction: phase === 2 ? "linear" : "ease-in-out",
              opacity: phase === 0 ? 0 : 1, // hide instantly on reset, show on draw
              transform: phase === 0 
                ? "translateX(0)" 
                : phase === 1 
                  ? "translateX(-40px)" // drawing back
                  : "translateX(250vw)" // shoot slowly across the screen
            }}
          >
            {/* Arrow Shaft */}
            <div className="h-1.5 w-24 sm:w-32 bg-[#5c2a07] rounded-l-full relative shadow-md">
              {/* Feathers at the back of arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-[1px]">
                  <div className="w-2 h-2.5 bg-red-400 rotate-45 -mt-1 ml-1" />
                  <div className="w-2 h-2.5 bg-red-400 rotate-45 -mt-1" />
              </div>
            </div>
            {/* Heart Tip (bottom points right) */}
            <img 
              src="/heart.png" 
              alt="Heart Head" 
              className="w-8 sm:w-10 h-auto -ml-3 drop-shadow-md -rotate-90 relative z-10" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 bg-white/70 backdrop-blur-sm px-12 py-10 rounded-3xl shadow-2xl border border-pink-200 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-pink-600 tracking-tighter drop-shadow-sm text-center">
          UBC Weekly Dating
        </h1>

        <p className="mb-10 text-lg md:text-xl text-gray-700 font-medium text-center">
          One curated campus date every week.
        </p>

        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-xl"
          onClick={() => router.push("/login")}
        >
          Start Matching
        </button>
      </div>

    </div>
  )
}