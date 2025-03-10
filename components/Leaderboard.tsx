"use client"

import { useEffect, useState } from "react"

interface UserScore {
  userId: string
  userName: string
  totalScore: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch("/api/predictions")
        const data = await res.json()

        // Fetch actual match results
        const resultsRes = await fetch("/api/matches")
        const resultsData = await resultsRes.json()

        const matchResults = resultsData.matches.reduce((acc: any, match: any) => {
          acc[match.id] = match.score.fullTime
          return acc
        }, {})

        // Calculate scores
        const userScores: Record<string, UserScore> = {}

        data.predictions.forEach((p: any) => {
          if (!userScores[p.userId]) {
            userScores[p.userId] = { userId: p.userId, userName: p.userName, totalScore: 0 }
          }

          if (matchResults[p.matchId]) {
            const actualScore = matchResults[p.matchId]
            const [predHome, predAway] = p.prediction.split("-").map(Number)

            let points = 0
            if (predHome === actualScore.homeTeam && predAway === actualScore.awayTeam) {
              points = 3
            } else if (
              (predHome > predAway && actualScore.homeTeam > actualScore.awayTeam) ||
              (predHome < predAway && actualScore.homeTeam < actualScore.awayTeam)
            ) {
              points = 1
            }

            userScores[p.userId].totalScore += points
          }
        })

        setLeaderboard(Object.values(userScores).sort((a, b) => b.totalScore - a.totalScore))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [])

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-black">
      <h2 className="text-xl font-semibold mb-4">🏆 Prediction Leaderboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p>No predictions yet.</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard.map((user, index) => (
            <li key={index} className="border p-3 bg-white rounded shadow-sm flex justify-between">
              <span className="text-gray-700">🔹 {user.userName}</span>
              <span className="font-semibold">{user.totalScore} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}