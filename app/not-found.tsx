"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 20 })
  const [direction, setDirection] = useState({ x: 1, y: 1 })
  const [speed] = useState(0.15)

  useEffect(() => {
    const interval = setInterval(() => {
      setBallPosition(prev => {
        const newX = prev.x + direction.x * speed
        const newY = prev.y + direction.y * speed
        let newDirX = direction.x
        let newDirY = direction.y

        // Bounce off the edges
        if (newX <= 0 || newX >= 100) {
          newDirX = -newDirX
        }
        if (newY <= 0 || newY >= 100) {
          newDirY = -newDirY
        }

        setDirection({ x: newDirX, y: newDirY })
        return { x: newX, y: newY }
      })
    }, 10)

    return () => clearInterval(interval)
  }, [direction, speed])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated football */}
      <div 
        className="absolute w-16 h-16 bg-white rounded-full shadow-lg z-10"
        style={{ 
          left: `${ballPosition.x}%`, 
          top: `${ballPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          background: `
            radial-gradient(circle at 65% 15%, white 1px, transparent 0%),
            radial-gradient(circle at 35% 15%, white 1px, transparent 0%),
            radial-gradient(circle at 50% 40%, white 1px, transparent 0%),
            radial-gradient(circle at 35% 65%, white 1px, transparent 0%),
            radial-gradient(circle at 65% 65%, white 1px, transparent 0%),
            #000
          `
        }}
      />
      
      {/* Stadium lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80%] h-[70%] border-4 border-white/30 rounded-lg"></div>
        <div className="absolute w-[40%] h-[40%] border-4 border-white/20 rounded-lg"></div>
        <div className="absolute w-16 h-16 border-4 border-white/20 rounded-full"></div>
        <div className="absolute w-[80%] h-[1px] bg-white/20"></div>
        <div className="absolute w-[1px] h-[70%] bg-white/20"></div>
      </div>
      
      <div className="text-center z-10 bg-blue-800/70 p-8 rounded-xl backdrop-blur-sm shadow-xl border border-blue-600/50 max-w-lg">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-blue-100 mb-6">Page Out of Bounds!</h2>
        <p className="text-blue-200 mb-8 text-lg">
          Looks like this play went off the field. The page you are looking for has been substituted or does not exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 shadow-lg">
            Back to Home
          </Link>
          <Link href="/matches" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 shadow-lg">
            View Matches
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-4 left-4 text-blue-300/70 text-sm">
        Referencess Decision: Error 404 - Page Not Found
      </div>
      
      {/* Animated goal posts */}
      <div className="absolute bottom-0 left-10 w-40 h-24 border-t-4 border-l-4 border-r-4 border-white/30"></div>
      <div className="absolute bottom-0 right-10 w-40 h-24 border-t-4 border-l-4 border-r-4 border-white/30"></div>
    </div>
  )
}