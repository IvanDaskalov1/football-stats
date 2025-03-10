"use client"

import React, { useState, useEffect } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import dayjs from "dayjs"
import styles from "./CalendarComponent.module.css" // Import custom styles

interface Match {
  id: number
  utcDate: string
  homeTeam: { name: string }
  awayTeam: { name: string }
  status: string
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
}

export default function CalendarComponent() {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/matches", { cache: "no-store" }) // Fetch from API route
        if (!res.ok) throw new Error("Грешка при зареждане на мачовете")
        const data = await res.json()
        setMatches(data.matches)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  // Create a Set of match dates for quick lookup
  const matchDates = new Set(matches.map(match => dayjs(match.utcDate).format("YYYY-MM-DD")))

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-black">
      {loading ? (
        <p>Зареждане...</p>
      ) : (
        <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            className={styles.calendar} // Apply custom styles
            tileClassName={({ date }) =>
              matchDates.has(dayjs(date).format("YYYY-MM-DD")) ? styles.matchDay : ""
            }
          />
        </div>
      )}

      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Мачове за {dayjs(selectedDate).format("DD/MM/YYYY")}
          </h3>
          <ul>
            {matches
              .filter(match => dayjs(match.utcDate).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD"))
              .map(match => (
                <li key={match.id} className="mt-2 border p-2 rounded flex justify-between items-center">
                  <div>
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </div>

                  {/* Show Live Score if the match is in play */}
                  {match.status === "IN_PLAY" && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded">
                      LIVE: {match.score.fullTime.home ?? 0} - {match.score.fullTime.away ?? 0}
                    </span>
                  )}

                  {/* Show Final Score if match is finished */}
                  {match.status === "FINISHED" && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded">
                      Завършил: {match.score.fullTime.home} - {match.score.fullTime.away}
                    </span>
                  )}

                  {/* Show Match Time if the match is scheduled */}
                  {match.status === "SCHEDULED" && (
                    <span className="text-gray-500">{new Date(match.utcDate).toLocaleTimeString()}</span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}