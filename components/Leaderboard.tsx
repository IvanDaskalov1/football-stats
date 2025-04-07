"use client"

import { useEffect, useState } from "react"
import { Match, Prediction, UserScore } from "@/types"

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<UserScore[]>([])
  const [loading, setLoading] = useState(true)

  type MatchResult = {
    home: number
    away: number
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch predictions
        const predictionsRes = await fetch("/api/predictions")
        const predictionsData = await predictionsRes.json()
        const predictions: Prediction[] = predictionsData.predictions || []

        // Fetch matches to get results
        const matchesRes = await fetch("/api/matches")
        const matchesData = await matchesRes.json()
        const matches: Match[] = matchesData.matches || []

        // Create a map of match results for quick lookup
        const matchResults = matches.reduce((acc: Record<number, MatchResult>, match: Match) => {
          // Only include finished matches
          if (match.status === "FINISHED" && match.score?.fullTime?.home !== null && match.score?.fullTime?.away !== null) {
            acc[match.id] = {
              home: match.score.fullTime.home,
              away: match.score.fullTime.away
            }
          }
          return acc
        }, {})

        // Calculate scores for each user
        const userScores: Record<string, UserScore> = {}

        predictions.forEach((prediction: Prediction) => {
          // Initialize user if not already in the map
          if (!userScores[prediction.userId]) {
            userScores[prediction.userId] = { 
              userId: prediction.userId, 
              userName: prediction.userName, 
              totalScore: 0,
              correctScores: 0,
              correctOutcomes: 0
            }
          }

          // Only calculate points if the match is finished and has a result
          if (matchResults[prediction.matchId]) {
            const actualResult = matchResults[prediction.matchId]
            
            // Parse prediction (format: "2-1")
            const [predHome, predAway] = prediction.prediction.split("-").map(Number)
            
            // Skip invalid predictions
            if (isNaN(predHome) || isNaN(predAway)) return
            
            // Calculate points:
            // 3 points for exact score
            // 1 point for correct outcome (win/loss/draw)
            let points = 0
            const user = userScores[prediction.userId]; // Store reference to avoid undefined
            
            // Exact score match
            if (predHome === actualResult.home && predAway === actualResult.away) {
              points = 3
              user.correctScores += 1;
            } 
            // Correct outcome
            else if (
              (predHome > predAway && actualResult.home > actualResult.away) || // Home win
              (predHome < predAway && actualResult.home < actualResult.away) || // Away win
              (predHome === predAway && actualResult.home === actualResult.away) // Draw
            ) {
              points = 1
              user.correctOutcomes += 1;
            }

            user.totalScore += points;
          }
        })

        // Sort by total score (descending)
        const sortedLeaderboard = Object.values(userScores)
          .sort((a, b) => b.totalScore - a.totalScore)
        
        setLeaderboard(sortedLeaderboard)
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-black">
      <h2 className="text-xl font-semibold mb-4">🏆 Prediction Leaderboard</h2>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p>No predictions yet. Be the first to predict!</p>
      ) : (
        <div>
          <div className="grid grid-cols-4 font-semibold mb-2 text-sm">
            <span>Player</span>
            <span className="text-center">Exact Scores</span>
            <span className="text-center">Correct Results</span>
            <span className="text-right">Total Points</span>
          </div>
          <ul className="space-y-2">
            {leaderboard.map((user, index) => (
              <li key={user.userId} className="border p-3 bg-white rounded shadow-sm grid grid-cols-4 items-center">
                <span className="text-gray-700">
                  {index === 0 && "🥇 "}
                  {index === 1 && "🥈 "}
                  {index === 2 && "🥉 "}
                  {index > 2 && `${index + 1}. `}
                  {user.userName}
                </span>
                <span className="text-center text-green-600">{user.correctScores || 0}</span>
                <span className="text-center text-blue-600">{user.correctOutcomes || 0}</span>
                <span className="font-semibold text-right">{user.totalScore} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}