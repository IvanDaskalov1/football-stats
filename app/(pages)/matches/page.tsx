"use client"

import { useEffect, useState } from "react"

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/matches") // Използваме API Route
        if (!res.ok) throw new Error(`Грешка при заявката: ${res.statusText}`)

        const data = await res.json()
        setMatches(Array.isArray(data.matches) ? data.matches : [])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Предстоящи мачове</h1>
      {loading && <p>Зареждане...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p className="text-gray-600">Няма налични мачове в момента.</p>
      )}

      {!loading && !error && matches.length > 0 && (
        <ul>
          {matches.map((match) => (
            <li key={match.id} className="border p-4 mb-2">
              <div className="flex justify-between items-center">
                <span>
                  {match.homeTeam.name} vs {match.awayTeam.name} -{" "}
                  {new Date(match.utcDate).toLocaleString()}
                </span>
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}